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
} from './providers/native-media-session';
import {
  usePlayerCurrentSongSelect,
  usePlayerSongsSelect,
  usePlayerStoreActions,
  getPlayerState,
} from './store/player.store';

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
    if (!navigator?.mediaSession) return;

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
    navigator.mediaSession.setActionHandler('previoustrack', () => previousSong());
    navigator.mediaSession.setActionHandler('seekto', (s) => {
      if (s.seekTime != null) seek(s.seekTime);
    });
  }, [play, pause, nextSong, previousSong, seek]);

  useEffect(() => {
    if (!currentSong || !songImage || songImage.length === 0) return;
    if (!navigator?.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title ?? '',
      artist: currentSong.author ?? '',
      album: currentSong.album ?? '',
      artwork: [{ src: songImage, sizes: '512x512', type: 'image/jpeg' }],
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
    }
  }, [isPlaying]);

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
    <div className="w-full h-20 bg-black">
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