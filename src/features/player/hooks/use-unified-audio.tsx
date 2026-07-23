import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { isNativeApp } from '~/utils/platform';
import { logMediaEvent } from '~/features/player/components/media-session-debug';

const AUDIO_ID = 'main-player';

let AudioPlayer: typeof import('@mediagrid/capacitor-native-audio').AudioPlayer | null = null;

const isNativePlatform = (): boolean => {
  try {
    if (!isNativeApp()) return false;
    if (typeof window === 'undefined') return false;
    
    if (!AudioPlayer) {
      const audioModule = require('@mediagrid/capacitor-native-audio');
      AudioPlayer = audioModule.AudioPlayer;
    }
    
    return AudioPlayer !== null && AudioPlayer !== undefined;
  } catch {
    return false;
  }
};

interface LoadOptions {
  autoplay?: boolean;
  html5?: boolean;
  format?: string;
  onend?: () => void;
  volume?: number;
  title?: string;
  artist?: string;
  artwork?: string;
}

interface UnifiedAudioPlayer {
  load(url: string, options?: LoadOptions): void;
  play(): void;
  pause(): void;
  stop(): void;
  togglePlayPause(): void;
  seek(time: number): void;
  getPosition(): number;
  isPlaying: boolean;
  duration: number;
  volume: number;
  setVolume(v: number): void;
}

const UnifiedAudioContext = createContext<UnifiedAudioPlayer | null>(null);

export const UnifiedAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const player = useUnifiedAudioImpl();

  return (
    <UnifiedAudioContext.Provider value={player}>
      {children}
    </UnifiedAudioContext.Provider>
  );
};

// Every consumer used to call useUnifiedAudioImpl() (as useUnifiedAudio())
// directly instead of reading it from UnifiedAudioProvider's context, so
// each of the ~7 call sites created its own independent instance of the
// hook below - each attaching its own full set of <audio> event listeners
// to the one shared persistentAudio element. That meant every play/pause/
// stall/etc event fired the listener body 7x redundantly on every state
// change, all session. This is the real hook every component should use;
// it reads the single shared instance the Provider already creates.
export const useUnifiedAudio = (): UnifiedAudioPlayer => {
  const ctx = useContext(UnifiedAudioContext);
  if (!ctx) {
    throw new Error('useUnifiedAudio must be used within a UnifiedAudioProvider');
  }
  return ctx;
};

let persistentAudio: HTMLAudioElement | null = null;

// iOS drops a page's background-audio "occupancy" the moment its <audio>
// element goes fully silent (e.g. the "ended" event), and won't grant it
// back for a brand-new source loaded afterward - even a source that's
// already downloaded as an in-memory Blob with zero network dependency.
// That gap between one track ending and the next one's play() actually
// resolving is exactly when the real symptoms happen: sometimes the new
// track's audio pipeline just never finishes initializing until the page
// is unlocked (frozen at readyState 0), other times play() succeeds but
// produces no audible output at all. This second, silent, looping <audio>
// element is started the instant the real track ends and stopped once the
// next real track's play() has resolved, keeping the page continuously
// "occupied" so the gap never has a chance to open. This is the same
// technique independently converged on by multiple other iOS web music
// players (e.g. SoundWheel) for this exact WebKit limitation.
const SILENT_AUDIO_SRC =
  'data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';

let silentBridgeAudio: HTMLAudioElement | null = null;
let silentBridgeCount = 0;

function getSilentBridgeAudio(): HTMLAudioElement {
  if (!silentBridgeAudio) {
    silentBridgeAudio = new Audio(SILENT_AUDIO_SRC);
    silentBridgeAudio.loop = true;
    (
      silentBridgeAudio as HTMLAudioElement & { playsInline: boolean }
    ).playsInline = true;
  }
  return silentBridgeAudio;
}

function startSilentBridge(): void {
  silentBridgeCount += 1;
  if (silentBridgeCount > 1) return;
  const audio = getSilentBridgeAudio();
  audio.play().catch(() => {});
  logMediaEvent('silentBridge started');

  // Safety backstop: if the next real track's load()/play() never resolves
  // for some unrelated reason (network failure, corrupt file, etc.), don't
  // leave the silent bridge looping indefinitely draining battery.
  setTimeout(() => {
    if (silentBridgeCount > 0) {
      logMediaEvent('silentBridge safety timeout - forcing stop');
      silentBridgeCount = 0;
      silentBridgeAudio?.pause();
    }
  }, 30000);
}

function stopSilentBridge(): void {
  silentBridgeCount = Math.max(0, silentBridgeCount - 1);
  if (silentBridgeCount > 0) return;
  silentBridgeAudio?.pause();
  logMediaEvent('silentBridge stopped');
}

type NativeStateCallback = (updates: { isPlaying?: boolean; duration?: number }) => void;
const nativeSubscribers = new Set<NativeStateCallback>();
let nativeCurrentTime = 0;
let nativeIsPlayingGlobal = false;
let nativeDurationGlobal = 0;
let nativeVolumeGlobal = 1;
let nativeInitialized = false;
let nativeOnEndCallback: (() => void) | null = null;
let nativePollingTimer: ReturnType<typeof setInterval> | null = null;
let skipPositionUpdate = false;
let webSeekTargetTime = 0;

// Rapid track changes (e.g. mashing lock-screen next/prev) can call
// loadNativeAudio again before the previous destroy/create/initialize chain
// for the fixed AUDIO_ID has finished, and the native side rejects a create()
// for an ID that still exists. That left stale callbacks registered against
// whatever track actually won the race, showing the wrong title/artwork and
// sometimes failing to auto-advance. Each load() call captures the current
// generation and every step after an await bails out if a newer load has
// since started, and calls are chained through loadQueue so destroy/create
// for one request always finishes before the next request's begins.
let loadGeneration = 0;
let loadQueue: Promise<void> = Promise.resolve();

function broadcastNativeState(updates: { isPlaying?: boolean; duration?: number }): void {
  if (updates.isPlaying !== undefined) nativeIsPlayingGlobal = updates.isPlaying;
  if (updates.duration !== undefined) nativeDurationGlobal = updates.duration;
  nativeSubscribers.forEach((cb) => cb(updates));
}

function startNativePolling(): void {
  if (nativePollingTimer) return;
  if (!AudioPlayer) return;
  nativePollingTimer = setInterval(async () => {
    if (!nativeInitialized) return;
    if (skipPositionUpdate) return;
    try {
      const { currentTime } = await AudioPlayer!.getCurrentTime({ audioId: AUDIO_ID });
      nativeCurrentTime = currentTime;
      broadcastNativeState({ isPlaying: nativeIsPlayingGlobal, duration: nativeDurationGlobal });
    } catch (_) {}
  }, 100);
}

function stopNativePolling(): void {
  if (nativePollingTimer) {
    clearInterval(nativePollingTimer);
    nativePollingTimer = null;
  }
}

async function loadNativeAudioNow(url: string, options: LoadOptions): Promise<void> {
  if (!AudioPlayer) return;

  const generation = ++loadGeneration;
  const isCurrent = () => generation === loadGeneration;

  if (nativeInitialized) {
    stopNativePolling();
    try {
      await AudioPlayer.destroy({ audioId: AUDIO_ID });
    } catch (_) {}
    nativeInitialized = false;
    nativeCurrentTime = 0;
  }

  if (!isCurrent()) return;

  if (options.onend) {
    nativeOnEndCallback = options.onend;
  }

  try {
    await AudioPlayer.create({
      audioId: AUDIO_ID,
      audioSource: url,
      friendlyTitle: options.title ?? 'Now Playing',
      artistName: options.artist ?? '',
      artworkSource: options.artwork ?? '',
      useForNotification: true,
      // iOS only ever shows one set of secondary lock-screen transport
      // buttons: either prev/next track OR skip +/-N seconds, never both.
      // We want prev/next (wired via @capgo/capacitor-media-session) for
      // playlist navigation, so the skip buttons must be disabled here or
      // iOS hides prev/next in favor of them.
      showSeekBackward: false,
      showSeekForward: false,
    });

    if (!isCurrent()) {
      // A newer load has already started; give up this AUDIO_ID cleanly so
      // its create() doesn't linger and collide with the next one.
      await AudioPlayer.destroy({ audioId: AUDIO_ID }).catch(() => {});
      return;
    }

    AudioPlayer.onAudioReady({ audioId: AUDIO_ID }, async () => {
      if (!isCurrent()) return;
      try {
        const { duration } = await AudioPlayer!.getDuration({ audioId: AUDIO_ID });
        if (isCurrent()) broadcastNativeState({ duration });
      } catch (_) {}

      if (options.autoplay && isCurrent()) {
        try {
          await AudioPlayer!.play({ audioId: AUDIO_ID });
          if (isCurrent()) {
            broadcastNativeState({ isPlaying: true });
            startNativePolling();
          }
        } catch (_) {}
      }
    });

    AudioPlayer.onAudioEnd({ audioId: AUDIO_ID }, () => {
      if (!isCurrent()) return;
      broadcastNativeState({ isPlaying: false });
      stopNativePolling();
      nativeCurrentTime = 0;
      nativeOnEndCallback?.();
    });

    AudioPlayer.onPlaybackStatusChange({ audioId: AUDIO_ID }, ({ status }) => {
      if (!isCurrent()) return;
      const playing = status === 'playing';
      broadcastNativeState({ isPlaying: playing });
      if (playing) {
        startNativePolling();
      } else {
        stopNativePolling();
      }
    });

    if (options.volume !== undefined && AudioPlayer) {
      nativeVolumeGlobal = options.volume;
      await AudioPlayer.setVolume({ audioId: AUDIO_ID, volume: options.volume });
    }

    if (AudioPlayer && isCurrent()) {
      await AudioPlayer.initialize({ audioId: AUDIO_ID });
      if (isCurrent()) nativeInitialized = true;
    }
  } catch (err) {
    console.error('[NativeAudio] load error:', err);
  }
}

function loadNativeAudio(url: string, options: LoadOptions): void {
  loadQueue = loadQueue.then(() => loadNativeAudioNow(url, options));
}

const useUnifiedAudioImpl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const onEndRef = useRef<(() => void) | null>(null);

  const isNative = isNativePlatform();

  useEffect(() => {
    if (isNative) return;

    if (!persistentAudio) {
      persistentAudio = new Audio();
      persistentAudio.preload = 'metadata';
      (persistentAudio as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
      persistentAudio.crossOrigin = 'anonymous';
    }

    // WebKit bug 261554: without this, a backgrounded/locked page's <audio>
    // keeps running - play() resolves, currentTime advances, "ended"/
    // "canplay"/etc events all fire normally - but produces literally no
    // sound, because WebKit doesn't know this page intends persistent
    // background audio (vs. e.g. a one-off UI sound effect) unless told so
    // explicitly. Matches the exact symptom reported: track advances and
    // the position UI updates, but nothing plays until the page is
    // foregrounded again.
    const nav = navigator as Navigator & {
      audioSession?: { type: string };
    };
    if (nav.audioSession) {
      try {
        nav.audioSession.type = 'playback';
        logMediaEvent(
          `navigator.audioSession.type set to "playback" (was "${nav.audioSession.type}")`,
        );
      } catch (err) {
        logMediaEvent(`navigator.audioSession.type set failed: ${err}`);
      }
    } else {
      logMediaEvent('navigator.audioSession API not available');
    }

    const audio = persistentAudio;

    const handleEnded = () => {
      logMediaEvent('persistentAudio "ended" event');
      setIsPlaying(false);
      // Bridge the gap until the next track's load()/play() call stops it
      // (see startSilentBridge/stopSilentBridge above).
      startSilentBridge();
      if (onEndRef.current) onEndRef.current();
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      logMediaEvent(
        `persistentAudio "pause" event visibility=${typeof document !== 'undefined' ? document.visibilityState : '?'}`,
      );
      setIsPlaying(false);
    };
    const handleError = () => {
      const err = audio.error;
      logMediaEvent(
        `persistentAudio "error" event code=${err?.code} message=${err?.message}`,
      );
    };
    const handleStalled = () => logMediaEvent('persistentAudio "stalled" event');
    const handleWaiting = () => logMediaEvent('persistentAudio "waiting" event');
    const handleSuspend = () => logMediaEvent('persistentAudio "suspend" event');

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('suspend', handleSuspend);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('suspend', handleSuspend);
    };
  }, [isNative]);

  useEffect(() => {
    if (!isNative) return;

    setIsPlaying(nativeIsPlayingGlobal);
    setDuration(nativeDurationGlobal);
    setVolumeState(nativeVolumeGlobal);

    const callback: NativeStateCallback = ({ isPlaying: ip, duration: dur }) => {
      if (ip !== undefined) setIsPlaying(ip);
      if (dur !== undefined) setDuration(dur);
    };

    nativeSubscribers.add(callback);
    return () => {
      nativeSubscribers.delete(callback);
    };
  }, [isNative]);

  const load = useCallback(
    (url: string, options: LoadOptions = {}) => {
      if (options.onend) onEndRef.current = options.onend;

      if (isNative) {
        loadNativeAudio(url, options);
      } else {
        if (!persistentAudio) return;

        if (persistentAudio.src === url && options.autoplay && !persistentAudio.paused) {
          return;
        }

        if (options.volume !== undefined) {
          persistentAudio.volume = options.volume;
          setVolumeState(options.volume);
        }

        const isBlobUrl = url.startsWith('blob:');
        persistentAudio.src = url;
        persistentAudio.load();
        logMediaEvent(
          `persistentAudio.load() isBlobUrl=${isBlobUrl} readyState=${persistentAudio.readyState} visibility=${typeof document !== 'undefined' ? document.visibilityState : '?'}`,
        );

        if (options.autoplay) {
          const tryPlay = () => {
            logMediaEvent(
              `persistentAudio.play() attempt readyState=${persistentAudio!.readyState} visibility=${typeof document !== 'undefined' ? document.visibilityState : '?'}`,
            );
            persistentAudio!
              .play()
              .then(() => {
                logMediaEvent('persistentAudio.play() resolved');
                setIsPlaying(true);
                // Real playback is confirmed running now; the bridge (if it
                // was running for this transition - safe to call
                // unconditionally, see stopSilentBridge above) is no longer
                // needed.
                stopSilentBridge();
              })
              .catch((err) => {
                logMediaEvent(`persistentAudio.play() rejected: ${err}`);
                setIsPlaying(false);
              });
          };

          if (persistentAudio.readyState >= 2) {
            tryPlay();
          } else {
            const onCanPlay = () => {
              logMediaEvent('persistentAudio canplay event fired');
              persistentAudio!.removeEventListener('canplay', onCanPlay);
              tryPlay();
            };
            persistentAudio.addEventListener('canplay', onCanPlay);
          }
        }
      }
    },
    [isNative],
  );

  const play = useCallback(() => {
    if (isNative && AudioPlayer) {
      AudioPlayer.play({ audioId: AUDIO_ID })
        .then(() => {
          broadcastNativeState({ isPlaying: true });
          startNativePolling();
        })
        .catch(() => {});
    } else {
      persistentAudio
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isNative]);

  const pause = useCallback(() => {
    if (isNative && AudioPlayer) {
      AudioPlayer.pause({ audioId: AUDIO_ID })
        .then(() => {
          broadcastNativeState({ isPlaying: false });
          stopNativePolling();
        })
        .catch(() => {});
    } else {
      if (!persistentAudio) return;
      persistentAudio.pause();
      setIsPlaying(false);
    }
  }, [isNative]);

  const stop = useCallback(() => {
    if (isNative && AudioPlayer) {
      AudioPlayer.stop({ audioId: AUDIO_ID })
        .then(() => {
          broadcastNativeState({ isPlaying: false, duration: 0 });
          stopNativePolling();
          nativeCurrentTime = 0;
        })
        .catch(() => {});
    } else {
      if (!persistentAudio) return;
      persistentAudio.pause();
      persistentAudio.currentTime = 0;
      setIsPlaying(false);
      setDuration(0);
      // An explicit stop (e.g. sign-out) should never leave the silent
      // bridge looping in the background.
      silentBridgeCount = 0;
      silentBridgeAudio?.pause();
    }
  }, [isNative]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (time: number) => {
      if (isNative) {
        if (AudioPlayer) {
          // Native iOS bridge (Capacitor's getInt) requires a true Int and
          // has no Double fallback, so fractional seconds are silently
          // rejected (AudioPlayerError.invalidSeekTime) and the seek is a
          // no-op. Always send a whole number of seconds.
          const seekSeconds = Math.round(time);
          skipPositionUpdate = true;
          nativeCurrentTime = seekSeconds;
          AudioPlayer.seek({ audioId: AUDIO_ID, timeInSeconds: seekSeconds }).catch(
            (err) => {
              console.error('[NativeAudio] seek error:', err);
            },
          );
          setTimeout(() => {
            skipPositionUpdate = false;
            nativeCurrentTime = seekSeconds;
          }, 500);
        }
      } else {
        if (!persistentAudio) return;
        // Setting currentTime on an <audio> element isn't instant - the
        // browser has to seek internally (especially over a network stream)
        // and can briefly read back stale/intermediate values while that
        // settles. Reading position via getPosition() right after a seek
        // (which the slider's polling loop does the moment it stops
        // dragging) could show the seek visibly bouncing before it
        // stabilizes. Mirrors the native path's skipPositionUpdate guard.
        skipPositionUpdate = true;
        webSeekTargetTime = time;
        persistentAudio.currentTime = time;
        setTimeout(() => {
          skipPositionUpdate = false;
        }, 500);
      }
    },
    [isNative],
  );

  const getPosition = useCallback(() => {
    if (isNative) return nativeCurrentTime;
    if (skipPositionUpdate) return webSeekTargetTime;
    return persistentAudio?.currentTime ?? 0;
  }, [isNative]);

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      if (isNative && AudioPlayer) {
        nativeVolumeGlobal = v;
        AudioPlayer.setVolume({ audioId: AUDIO_ID, volume: v }).catch(() => {});
      } else {
        if (persistentAudio) persistentAudio.volume = v;
      }
    },
    [isNative],
  );

  return {
    load,
    play,
    pause,
    stop,
    togglePlayPause,
    seek,
    getPosition,
    isPlaying,
    duration: duration ?? 0,
    volume,
    setVolume,
  };
};
