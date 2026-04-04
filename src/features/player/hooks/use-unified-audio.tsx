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

async function loadNativeAudio(url: string, options: LoadOptions): Promise<void> {
  if (!AudioPlayer) return;
  
  if (nativeInitialized) {
    stopNativePolling();
    try {
      await AudioPlayer.destroy({ audioId: AUDIO_ID });
    } catch (_) {}
    nativeInitialized = false;
    nativeCurrentTime = 0;
  }

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
    });

    AudioPlayer.onAudioReady({ audioId: AUDIO_ID }, async () => {
      try {
        const { duration } = await AudioPlayer!.getDuration({ audioId: AUDIO_ID });
        broadcastNativeState({ duration });
      } catch (_) {}

      if (options.autoplay) {
        try {
          await AudioPlayer!.play({ audioId: AUDIO_ID });
          broadcastNativeState({ isPlaying: true });
          startNativePolling();
        } catch (_) {}
      }
    });

    AudioPlayer.onAudioEnd({ audioId: AUDIO_ID }, () => {
      broadcastNativeState({ isPlaying: false });
      stopNativePolling();
      nativeCurrentTime = 0;
      nativeOnEndCallback?.();
    });

    AudioPlayer.onPlaybackStatusChange({ audioId: AUDIO_ID }, ({ status }) => {
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

    if (AudioPlayer) {
      await AudioPlayer.initialize({ audioId: AUDIO_ID });
      nativeInitialized = true;
    }
  } catch (err) {
    console.error('[NativeAudio] load error:', err);
  }
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
          skipPositionUpdate = true;
          nativeCurrentTime = time;
          AudioPlayer.seek({ audioId: AUDIO_ID, timeInSeconds: time }).catch(() => {});
          setTimeout(() => {
            skipPositionUpdate = false;
            nativeCurrentTime = time;
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
