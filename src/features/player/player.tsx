'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleSlider } from '~/components/ui/slider';
import { useLoadImage } from '~/hooks/use-load-image';
import { isNativeApp } from '~/utils/platform';
import { PlayerControls } from './components/player-controls';
import { PlayerDetails } from './components/player-details';
import { PlayerSettings } from './components/player-settings';
import { useAudioTime } from './hooks/use-audio-time';
import { useUnifiedAudio } from './hooks/use-unified-audio';
import { useLoadSongUrl } from './hooks/use-load-song-url';
import {
  setNativeMediaMetadata,
  setNativePlaybackState,
  setNativeActionHandlers,
  updateNativePositionState,
} from './providers/native-media-session';
import {
  usePlayerCurrentSongSelect,
  usePlayerSongsSelect,
  usePlayerStoreActions,
  getPlayerState,
} from './store/player.store';
import {
  MediaSessionDebugOverlay,
  recordMediaSessionAction,
  recordMediaSessionState,
} from './components/media-session-debug';

export function PlayerFeature() {
  const { load, seek, play, pause, isPlaying, setVolume } = useUnifiedAudio();
  const { nextSong, previousSong, setSongs } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songs = usePlayerSongsSelect();
  const songUrl = useLoadSongUrl(currentSong);
  const songImage = useLoadImage(currentSong);

  const loadRef = useRef(load);
  const setVolumeRef = useRef(setVolume);
  const nextSongRef = useRef(nextSong);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);
  useEffect(() => {
    setVolumeRef.current = setVolume;
  }, [setVolume]);
  useEffect(() => {
    nextSongRef.current = nextSong;
  }, [nextSong]);

  const handleEnded = useCallback(() => {
    nextSongRef.current();
  }, []);

  useEffect(() => {
    recordMediaSessionState({ hasMediaSession: !!navigator?.mediaSession });
    if (!navigator?.mediaSession) return;

    // iOS Safari only shows the "nexttrack"/"previoustrack" lock-screen
    // buttons if those handlers are registered after playback has actually
    // started; registering them at mount time (before the first play)
    // makes it silently fall back to its default +/-10s skip buttons
    // instead, even though the handlers are set correctly. Re-registering
    // once isPlaying flips true is a widely-confirmed workaround.
    if (!isPlaying) return;

    navigator.mediaSession.setActionHandler('play', () => {
      recordMediaSessionAction('play');
      play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      recordMediaSessionAction('pause');
      pause();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      recordMediaSessionAction('nexttrack');
      nextSong();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      recordMediaSessionAction('previoustrack');
      previousSong();
    });
    navigator.mediaSession.setActionHandler('seekto', (s) => {
      recordMediaSessionAction(`seekto:${s.seekTime}`);
      if (s.seekTime != null) seek(s.seekTime);
    });
  }, [isPlaying, play, pause, nextSong, previousSong, seek]);

  useEffect(() => {
    if (!currentSong || !songImage || songImage.length === 0) return;
    if (!navigator?.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title ?? '',
      artist: currentSong.author ?? '',
      album: currentSong.album ?? '',
      artwork: [{ src: songImage, sizes: '512x512', type: 'image/jpeg' }],
    });
    recordMediaSessionState({
      metadataTitle: currentSong.title ?? '',
      metadataArtwork: songImage,
    });
  }, [currentSong, songImage]);

  useEffect(() => {
    if (!currentSong || !songImage) return;
    if (!isNativeApp()) return;

    setNativeMediaMetadata(
      currentSong.title ?? '',
      currentSong.author ?? '',
      currentSong.album ?? '',
      songImage,
    );
    setNativeActionHandlers({
      play: () => play(),
      pause: () => pause(),
      next: () => nextSong(),
      previous: () => previousSong(),
      seekto: (time: number) => seek(time),
    });
  }, [currentSong, songImage, play, pause, nextSong, previousSong, seek]);

  useEffect(() => {
    if (isNativeApp()) {
      setNativePlaybackState(isPlaying ? 'playing' : 'paused');
    } else if (navigator?.mediaSession) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
    recordMediaSessionState({
      playbackState: isPlaying ? 'playing' : 'paused',
      isPlaying,
    });
  }, [isPlaying]);

  const { duration, getPosition } = useUnifiedAudio();

  useEffect(() => {
    if (!isPlaying) return;

    if (isNativeApp()) {
      const interval = setInterval(() => {
        const pos = getPosition();
        updateNativePositionState(duration, pos, 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    // Safari's lock-screen/Control Center scrubber and time labels rely on
    // setPositionState; without it the transport UI has no duration/position
    // to render (this mirrors the native fix for the same underlying gap).
    if (!navigator?.mediaSession?.setPositionState) return;
    if (!duration || !isFinite(duration)) return;

    const interval = setInterval(() => {
      const pos = getPosition();
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(pos, duration),
          playbackRate: 1,
        });
        recordMediaSessionState({ duration, position: pos });
      } catch (_) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, getPosition]);

  useEffect(() => {
    if (!songUrl) {
      return;
    }

    const userVolume = parseFloat(
      localStorage.getItem('player-volume') || '0.7',
    );
    setVolumeRef.current(userVolume);

    loadRef.current(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: handleEnded,
    });
  }, [songUrl]);

  if (!currentSong) return null;

  return (
    <div className="h-20 w-full bg-black">
      <MediaSessionDebugOverlay />
      <SeekSlider />
      <div className="px-4 py-2">
        <div className="grid h-full grid-cols-2 md:grid-cols-3">
          <PlayerDetails />
          <PlayerControls />
          <PlayerSettings />
        </div>
      </div>
    </div>
  );
}

function SeekSlider() {
  const time = useAudioTime();
  const { duration, play, pause, seek, isPlaying } = useUnifiedAudio();
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const wasPlayingRef = useRef(false);

  const displayValue = dragging ? dragValue : (time / duration) * 100;

  return (
    <SimpleSlider
      max={100}
      step={0.1}
      minStepsBetweenThumbs={1}
      value={isNaN(displayValue) || !duration ? 0 : displayValue}
      onValueChange={(value) => {
        if (!dragging) {
          wasPlayingRef.current = isPlaying;
          pause();
          setDragging(true);
        }
        setDragValue(value);
      }}
      onValueCommit={(value) => {
        seek(value * (duration / 100));
        setDragging(false);
        if (wasPlayingRef.current) {
          play();
        }
      }}
    />
  );
}
