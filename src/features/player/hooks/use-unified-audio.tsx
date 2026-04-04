import { createContext, useEffect, useRef, useState, useCallback } from 'react';

interface LoadOptions {
  autoplay?: boolean;
  html5?: boolean;
  format?: string;
  onend?: () => void;
  volume?: number;
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

export const useUnifiedAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const onEndRef = useRef<(() => void) | null>(null);
  
  // Initialize persistent audio element once
  useEffect(() => {
    if (!persistentAudio) {
      persistentAudio = new Audio();
      persistentAudio.preload = 'metadata';
    }
    
    const audio = persistentAudio;
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEndRef.current) {
        onEndRef.current();
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
    };
    
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
  }, []);
  
  const load = useCallback((url: string, options: LoadOptions = {}) => {
    if (!persistentAudio) return;
    
    if (persistentAudio.src === url) {
      if (options.autoplay && !persistentAudio.paused) {
        return;
      }
    }
    
    if (options.onend) {
      onEndRef.current = options.onend;
    }
    
    if (options.volume !== undefined) {
      persistentAudio.volume = options.volume;
      setVolume(options.volume);
    }
    
    persistentAudio.src = url;
    persistentAudio.load();
    
    if (options.autoplay) {
      const tryPlay = () => {
        persistentAudio!.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
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
  }, []);
  
  const play = useCallback(() => {
    if (!persistentAudio) return;
    persistentAudio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    if (!persistentAudio) return;
    persistentAudio.pause();
    setIsPlaying(false);
  }, []);
  
  const stop = useCallback(() => {
    if (!persistentAudio) return;
    persistentAudio.pause();
    persistentAudio.currentTime = 0;
    setIsPlaying(false);
    setDuration(0);
  }, []);
  
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);
  
  const seek = useCallback((time: number) => {
    if (!persistentAudio) return;
    persistentAudio.currentTime = time;
  }, []);
  
  const getPosition = useCallback(() => {
    return persistentAudio?.currentTime ?? 0;
  }, []);
  
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
    setVolume: (v: number) => {
      setVolume(v);
      if (persistentAudio) {
        persistentAudio.volume = v;
      }
    },
  };
};