'use client';

import { useEffect } from 'react';
import { Howler } from 'howler';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { SimpleSlider } from '~/components/ui/slider';
import { useLoadImage } from '~/hooks/use-load-image';
import { PlayerControls } from './components/player-controls';
import { PlayerDetails } from './components/player-details';
import { PlayerSettings } from './components/player-settings';
import { useAudioTime } from './hooks/use-audio-time';
import { useLoadSongUrl } from './hooks/use-load-song-url';
import {
  usePlayerCurrentSongSelect,
  usePlayerStoreActions,
} from './store/player.store';

export function PlayerFeature() {
  // Helper to set Media Session metadata and handlers
  // Helper to set Media Session metadata and handlers
  const setMediaSession = () => {
    if (currentSong && navigator && navigator.mediaSession) {
      if (!songImage || songImage.length === 0) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title ?? '',
        artist: currentSong.author ?? '',
        album: currentSong.album ?? '',
        artwork: [
          {
            src: songImage,
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      });
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('seekto', (s) => seek(s.seekTime!));
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousSong());
    }
  };
  // Reset player state and audio element
  const resetPlayer = () => {
    // Pause and unload audio
    pause();
    // Try to reset volume and mute state
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.load();
      audio.volume = 1;
      audio.muted = false;
    }
    // Optionally, reload the page or reset app state
    // window.location.reload();
  };
  const { load, seek, play, pause, isPlaying } = useAudioPlayerContext();
  const { nextSong, previousSong } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songUrl = useLoadSongUrl(currentSong);
  const songImage = useLoadImage(currentSong);

  // Always set Media Session metadata before playback, then load and play
  useEffect(() => {
    if (!songUrl) return;
    setMediaSession();
    const userVolume = parseFloat(localStorage.getItem('player-volume') || '0.7');
    Howler.volume(userVolume);
    load(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: () => nextSong(),
    });
    play();
    // Only depend on songUrl and nextSong to avoid infinite loop
    // load and play are stable from context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl, nextSong]);

  // Set Media Session API metadata and handlers on song change
  useEffect(() => {
    setMediaSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, songImage]);

  // Add robust listeners for all key audio events
  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const updateSession = () => setMediaSession();
    const handleError = (e: Event) => {
      // Optionally, show a user-friendly error or try to reload
      // For now, just log
      // eslint-disable-next-line no-console
      console.error('Audio error', e);
    };

    audio.addEventListener('play', updateSession);
    audio.addEventListener('playing', updateSession);
    audio.addEventListener('pause', updateSession);
    audio.addEventListener('ended', updateSession);
    audio.addEventListener('timeupdate', updateSession);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', updateSession);
      audio.removeEventListener('playing', updateSession);
      audio.removeEventListener('pause', updateSession);
      audio.removeEventListener('ended', updateSession);
      audio.removeEventListener('timeupdate', updateSession);
      audio.removeEventListener('error', handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, songImage]);

  if (!currentSong) return null;

  return (
    <div className="w-full h-20 max-md:bg-gradient-to-b max-md:from-blue-950">
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
  const { duration, pause, seek, togglePlayPause } = useAudioPlayerContext();

  return (
    <SimpleSlider
      max={100}
      step={0.1}
      minStepsBetweenThumbs={1}
      defaultValue={1}
      value={(time / duration) * 100}
      onValueCommit={togglePlayPause}
      onValueChange={(value) => {
        pause();
        seek(value * (duration / 100));
      }}
    />
  );
}
