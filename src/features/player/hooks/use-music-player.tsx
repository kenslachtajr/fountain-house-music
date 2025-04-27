import { create } from 'zustand';

interface AudioState {
  isLoading: boolean;
  isReady: boolean;
  duration: number;
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  volume: number;
  isMuted: boolean;
  rate: number;
  isLooping: boolean;
  error: string | null;
  audioElement: HTMLAudioElement | null;
  position: number;
  actions: AudioControls;
}

interface AudioControls {
  load: (params: LoadParams) => void;
  seek: (position: number) => void;
  getPosition: () => number;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  setRate: (rate: number) => void;
  loopOn: () => void;
  loopOff: () => void;
  toggleLoop: () => void;
  fade: (startVol: number, endVol: number, durationMs: number) => void;
}

interface LoadParams {
  url: string;
  autoplay?: boolean;
  loop?: boolean;
  initialVolume?: number;
  initialMute?: boolean;
  initialRate?: number;
  onplay?: () => void;
  onpause?: () => void;
  onload?: () => void;
  onend?: () => void;
  metadata?: {
    title: string;
    artist: string;
    album: string;
    artwork: string;
  };
}

const initialState: AudioState = {
  isLoading: false,
  isReady: false,
  duration: 0,
  isPlaying: false,
  isPaused: false,
  isStopped: true,
  volume: 1,
  isMuted: false,
  rate: 1,
  isLooping: false,
  error: null,
  audioElement: null,
  position: 0,
  actions: {
    load: () => {},
    seek: () => {},
    getPosition: () => 0,
    play: () => {},
    pause: () => {},
    togglePlayPause: () => {},
    stop: () => {},
    setVolume: () => {},
    mute: () => {},
    unmute: () => {},
    toggleMute: () => {},
    setRate: () => {},
    loopOn: () => {},
    loopOff: () => {},
    toggleLoop: () => {},
    fade: () => {},
  },
};

const useAudioStore = create<AudioState>((set, get) => ({
  ...initialState,
  actions: {
    load: (params: LoadParams) => {
      const {
        url,
        autoplay = false,
        loop = false,
        initialVolume = 1,
        initialMute = false,
        initialRate = 1,
        onplay,
        onpause,
        onload,
        onend,
        metadata,
      } = params;

      set({ isLoading: true, error: null });

      const audio = new Audio(url);
      audio.volume = initialVolume;
      audio.muted = initialMute;
      audio.playbackRate = initialRate;
      audio.loop = loop;

      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        set({
          isReady: true,
          isLoading: false,
          duration: audio.duration,
          audioElement: audio,
        });
        onload?.();
      });

      audio.addEventListener('play', () => {
        set({ isPlaying: true, isPaused: false, isStopped: false });
        onplay?.();
      });

      audio.addEventListener('pause', () => {
        set({ isPlaying: false, isPaused: true });
        onpause?.();
      });

      audio.addEventListener('ended', () => {
        set({ isPlaying: false, isPaused: false, isStopped: true });
        onend?.();
      });

      audio.addEventListener('error', (e) => {
        set({ error: 'Failed to load audio', isLoading: false });
      });

      // Set up position tracking
      const updatePosition = () => {
        set({ position: audio.currentTime });
        if (audio.currentTime < audio.duration) {
          requestAnimationFrame(updatePosition);
        }
      };
      audio.addEventListener('play', updatePosition);

      // Set up MediaSession API
      if (metadata && navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album,
          artwork: [
            { src: metadata.artwork, sizes: '512x512', type: 'image/jpeg' },
          ],
        });
      }

      if (autoplay) {
        audio.play().catch((error) => {
          set({ error: error.message, isLoading: false });
        });
      }
    },

    seek: (position: number) => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.currentTime = position;
        set({ position });
      }
    },

    getPosition: () => {
      return get().position;
    },

    play: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.play().catch((error) => {
          set({ error: error.message });
        });
      }
    },

    pause: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.pause();
      }
    },

    togglePlayPause: () => {
      const { isPlaying } = get();
      if (isPlaying) {
        get().actions.pause();
      } else {
        get().actions.play();
      }
    },

    stop: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        set({
          isPlaying: false,
          isPaused: false,
          isStopped: true,
          position: 0,
        });
      }
    },

    setVolume: (volume: number) => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.volume = Math.max(0, Math.min(1, volume));
        set({ volume, isMuted: volume === 0 });
      }
    },

    mute: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.muted = true;
        set({ isMuted: true });
      }
    },

    unmute: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.muted = false;
        set({ isMuted: false });
      }
    },

    toggleMute: () => {
      const { isMuted } = get();
      if (isMuted) {
        get().actions.unmute();
      } else {
        get().actions.mute();
      }
    },

    setRate: (rate: number) => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.playbackRate = rate;
        set({ rate });
      }
    },

    loopOn: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.loop = true;
        set({ isLooping: true });
      }
    },

    loopOff: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.loop = false;
        set({ isLooping: false });
      }
    },

    toggleLoop: () => {
      const { isLooping } = get();
      if (isLooping) {
        get().actions.loopOff();
      } else {
        get().actions.loopOn();
      }
    },

    fade: (startVol: number, endVol: number, durationMs: number) => {
      const { audioElement } = get();
      if (!audioElement) return;

      const startTime = performance.now();

      const fade = () => {
        const now = performance.now();
        const progress = Math.min(1, (now - startTime) / durationMs);
        const currentVolume = startVol + (endVol - startVol) * progress;

        audioElement.volume = currentVolume;
        set({ volume: currentVolume });

        if (progress < 1) {
          requestAnimationFrame(fade);
        }
      };

      fade();
    },
  },
}));

export const useMusicPlayerState = () => {
  const state = useAudioStore((state) => ({
    isLoading: state.isLoading,
    isReady: state.isReady,
    duration: state.duration,
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    isStopped: state.isStopped,
    volume: state.volume,
    isMuted: state.isMuted,
    rate: state.rate,
    isLooping: state.isLooping,
    error: state.error,
    position: state.position,
  }));
  return state;
};

export const useMusicPlayerActions = useAudioStore((state) => state.actions);
