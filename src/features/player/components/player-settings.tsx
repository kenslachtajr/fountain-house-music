import { useEffect, useRef, useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { SimpleSlider } from '~/components/ui/slider';
import { TimeLabel } from './player-time-label';

export function PlayerSettings() {
  const { setVolume, volume: currentVolume } = useAudioPlayerContext();
  const [muted, setMuted] = useState(false);
  const lastVolumeRef = useRef(currentVolume || 1);

  // Restore volume when song changes (if current is full volume)
  useEffect(() => {
    if (currentVolume === 1 && lastVolumeRef.current !== 1) {
      setVolume(lastVolumeRef.current);
    }
  }, [currentVolume, setVolume]);

  const VolumeIcon = muted ? HiSpeakerXMark : HiSpeakerWave;

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(lastVolumeRef.current);
    } else {
      setMuted(true);
      lastVolumeRef.current = currentVolume || 1;
      setVolume(0);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (!muted) {
      lastVolumeRef.current = value;
      setVolume(value);
    }
  };

  return (
    <div className="justify-end hidden w-full pr-2 md:flex">
      <div className="flex items-center w-3/5 gap-x-4">
        <TimeLabel />
        <VolumeIcon
          className="cursor-pointer h-9 w-9"
          size={34}
          onClick={toggleMute}
        />
        <SimpleSlider
          max={1}
          step={0.1}
          value={muted ? lastVolumeRef.current : currentVolume}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
