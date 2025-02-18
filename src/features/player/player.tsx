'use client';

import { useEffect } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
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
  const { load, seek, play, pause } = useGlobalAudioPlayer();
  const { nextSong, previousSong } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songUrl = useLoadSongUrl(currentSong);
  const songImage = useLoadImage(currentSong);

  useEffect(() => {
    if (!songUrl) return;
    load(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: () => nextSong(),
    });
  }, [load, nextSong, songUrl]);

  useEffect(() => {
    if (currentSong && navigator && navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title ?? '',
        artist: currentSong.author ?? '',
        album: currentSong.album ?? '',
        artwork: [
          {
            src: songImage ?? '/images/logo.jpg',
            sizes: '256x256',
            type: 'image/jpeg',
          },
        ],
      });
      navigator.mediaSession.setActionHandler('play', () => play());
      navigator.mediaSession.setActionHandler('seekto', (s) =>
        seek(s.seekTime!),
      );
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        previousSong(),
      );
    }
  }, [currentSong, songImage]);

  if (!currentSong) return null;

  return (
    <div className="w-full h-20 max-md:from-blue-950 max-md:bg-gradient-to-b ">
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
  const { duration, pause, seek, togglePlayPause } = useGlobalAudioPlayer();

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
