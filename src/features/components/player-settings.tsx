import { useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { SimpleSlider } from '~/components/ui/slider';
import { TimeLabel } from './player-time-label';

// !: muted from globalAudioPlayer is not a boolean, it's howler instance at times.
// !: https://github.com/E-Kuerschner/useAudioPlayer/issues/141

export function PlayerSettings() {
  const { setVolume, volume } = useGlobalAudioPlayer();
  const [prevVolume, setPrevVolume] = useState(volume || 1);

  const muted = volume === 0;
  const VolumeIcon = muted ? HiSpeakerXMark : HiSpeakerWave;

  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };

  return (
    <div className="justify-end hidden w-full pr-2 md:flex">
      <div className="flex items-center w-3/5 gap-x-4">
        <TimeLabel />
        <VolumeIcon
          className="cursor-pointer w-9 h-9"
          size={34}
          onClick={toggleMute}
        />
        <SimpleSlider
          max={1}
          step={0.1}
          defaultValue={1}
          value={muted ? prevVolume : volume}
          onValueChange={(value) => {
            setPrevVolume(value || 1);
            setVolume(value);
          }}
        />
      </div>
    </div>
  );
}
