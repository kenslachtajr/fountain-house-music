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
  usePlayerStoreActions,
} from './store/player.store';

export function PlayerFeature() {
  const { load, seek, play, pause, isPlaying, setVolume } = useUnifiedAudio();
  const { nextSong, previousSong } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songUrl = useLoadSongUrl(currentSong);
  const songImage = useLoadImage(currentSong);

  const playRef = useRef(play);
  const pauseRef = useRef(pause);
  const seekRef = useRef(seek);
  const nextSongRef = useRef(nextSong);
  const previousSongRef = useRef(previousSong);

  useEffect(() => { playRef.current = play; }, [play]);
  useEffect(() => { pauseRef.current = pause; }, [pause]);
  useEffect(() => { seekRef.current = seek; }, [seek]);
  useEffect(() => { nextSongRef.current = nextSong; }, [nextSong]);
  useEffect(() => { previousSongRef.current = previousSong; }, [previousSong]);

  const handleNextSong = useCallback(() => nextSongRef.current(), []);
  const handlePreviousSong = useCallback(() => previousSongRef.current(), []);

  useEffect(() => {
    if (!navigator?.mediaSession) return;

    navigator.mediaSession.setActionHandler('play', () => playRef.current());
    navigator.mediaSession.setActionHandler('pause', () => pauseRef.current());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextSongRef.current());
    navigator.mediaSession.setActionHandler('previoustrack', () => previousSongRef.current());
    navigator.mediaSession.setActionHandler('seekto', (s) => {
      if (s.seekTime != null) seekRef.current(s.seekTime);
    });
  }, []);

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
      play: () => playRef.current(),
      pause: () => pauseRef.current(),
      next: () => nextSongRef.current(),
      previous: () => previousSongRef.current(),
      seekto: (time: number) => seekRef.current(time),
    });
  }, [currentSong, songImage]);

  useEffect(() => {
    if (isNativeApp()) {
      setNativePlaybackState(isPlaying ? 'playing' : 'paused');
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!songUrl) return;

    const userVolume = parseFloat(
      localStorage.getItem('player-volume') || '0.7',
    );
    setVolume(userVolume);

    load(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: () => nextSongRef.current(),
    });
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl]);

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const updatePositionState = () => {
      if (!navigator?.mediaSession || !audio.duration || !isFinite(audio.duration)) return;
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          position: audio.currentTime,
          playbackRate: audio.playbackRate,
        });
      } catch {}
    };

    const handlePlay = () => updatePositionState();
    const handlePause = () => updatePositionState();
    const handleEnded = () => nextSongRef.current();
    const handleTimeUpdate = () => updatePositionState();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSong]);

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
