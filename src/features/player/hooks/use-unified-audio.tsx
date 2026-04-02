'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { Howler } from 'howler';

interface LoadOptions {
  autoplay?: boolean;
  html5?: boolean;
  format?: string;
  onend?: () => void;
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

function useWebAudioPlayer(): UnifiedAudioPlayer {
  const ctx = useAudioPlayerContext();
  const howlerRef = useRef(Howler);

  const setVolume = useCallback((v: number) => {
    howlerRef.current.volume(v);
  }, []);

  return {
    load: ctx.load,
    play: ctx.play,
    pause: ctx.pause,
    stop: ctx.stop,
    togglePlayPause: ctx.togglePlayPause,
    seek: ctx.seek,
    getPosition: ctx.getPosition,
    isPlaying: ctx.isPlaying,
    duration: ctx.duration,
    volume: ctx.volume,
    setVolume,
  };
}

export function UnifiedAudioProvider({ children }: PropsWithChildren) {
  const player = useWebAudioPlayer();

  return (
    <UnifiedAudioContext.Provider value={player}>
      {children}
    </UnifiedAudioContext.Provider>
  );
}

export function useUnifiedAudio(): UnifiedAudioPlayer {
  const ctx = useContext(UnifiedAudioContext);
  if (!ctx) {
    throw new Error('useUnifiedAudio must be used within UnifiedAudioProvider');
  }
  return ctx;
}
