'use client';

import { useEffect } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { Slider } from '~/components/ui/slider';
import useLoadSongUrl from '~/hooks/useLoadSongUrl';
import { PlayerControls } from './components/player-controls';
import { PlayerDetails } from './components/player-details';
import { PlayerVolume } from './components/player-volume';
import { useAudioTime } from './hooks/use-audio-time';
import {
  usePlayerCurrentSongSelect,
  usePlayerStoreActions,
} from './store/player.store';

export function PlayerFeature() {
  const { load } = useGlobalAudioPlayer();
  const { nextSong } = usePlayerStoreActions();

  const currentSong = usePlayerCurrentSongSelect();
  const songUrl = useLoadSongUrl(currentSong);

  useEffect(() => {
    if (!songUrl) return;
    load(songUrl, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onend: () => nextSong(),
    });
  }, [load, nextSong, songUrl]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 w-full h-20 bg-black">
      <SeekSlider />
      <div className="px-4 py-2">
        <div className="grid h-full grid-cols-2 md:grid-cols-3">
          <PlayerDetails />
          <PlayerControls />
          <PlayerVolume />
        </div>
      </div>
    </div>
  );
}

function SeekSlider() {
  const time = useAudioTime();
  const { duration, pause, seek, togglePlayPause } = useGlobalAudioPlayer();

  return (
    <Slider
      max={100}
      step={0.1}
      minStepsBetweenThumbs={1}
      defaultValue={[1]}
      value={[(time / duration) * 100]}
      onValueCommit={togglePlayPause}
      onValueChange={([val]) => {
        pause();
        seek(val * (duration / 100));
      }}
    />
  );
}
