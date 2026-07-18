import { createContext, useEffect, useRef, useState, useCallback } from 'react';
import { isNativeApp } from '~/utils/platform';

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
  const player = useUnifiedAudio();

  return (
    <UnifiedAudioContext.Provider value={player}>
      {children}
    </UnifiedAudioContext.Provider>
  );
};

let persistentAudio: HTMLAudioElement | null = null;

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

export const useUnifiedAudio = () => {
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

    const audio = persistentAudio;

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEndRef.current) onEndRef.current();
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (_e: Event) => {};

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
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

        persistentAudio.src = url;
        persistentAudio.load();

        if (options.autoplay) {
          const tryPlay = () => {
            persistentAudio!
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          };

          if (persistentAudio.readyState >= 2) {
            tryPlay();
          } else {
            const onCanPlay = () => {
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
        persistentAudio.currentTime = time;
      }
    },
    [isNative],
  );

  const getPosition = useCallback(() => {
    if (isNative) return nativeCurrentTime;
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
