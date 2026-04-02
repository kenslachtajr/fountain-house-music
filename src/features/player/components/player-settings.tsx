import { useEffect, useRef, useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useUnifiedAudio } from '../hooks/use-unified-audio';
import { SimpleSlider } from '~/components/ui/slider';
import { TimeLabel } from './player-time-label';

export function PlayerSettings() {
  const { setVolume, volume: currentVolume } = useUnifiedAudio();
  const [muted, setMuted] = useState(false);
  const [localVolume, setLocalVolume] = useState(currentVolume || 0.7);
  const lastVolumeRef = useRef(localVolume);

  useEffect(() => {
    setLocalVolume(currentVolume);
    lastVolumeRef.current = currentVolume || 0.7;
  }, [currentVolume]);

  const VolumeIcon = muted ? HiSpeakerXMark : HiSpeakerWave;

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(lastVolumeRef.current);
    } else {
      setMuted(true);
      lastVolumeRef.current = localVolume;
      setVolume(0);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (!muted) {
      lastVolumeRef.current = value;
      setLocalVolume(value);
      setVolume(value);
      localStorage.setItem('player-volume', String(value));
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
          value={muted ? lastVolumeRef.current : localVolume}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
