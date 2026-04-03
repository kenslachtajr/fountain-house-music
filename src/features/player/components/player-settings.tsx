import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useUnifiedAudio } from '../hooks/use-unified-audio';
import { SimpleSlider } from '~/components/ui/slider';
import { TimeLabel } from './player-time-label';

export function PlayerSettings() {
  const { setVolume, volume: currentVolume } = useUnifiedAudio();
  const [muted, setMuted] = useState(false);
  
  const [localVolume, setLocalVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('player-volume') || '0.7');
    }
    return 0.7;
  });
  const lastVolumeRef = useRef(localVolume);
  const isInitializedRef = useRef(false);

  useLayoutEffect(() => {
    if (!isInitializedRef.current) {
      // Initialize from either current audio volume or localStorage
      const initVolume = currentVolume > 0 ? currentVolume : parseFloat(localStorage.getItem('player-volume') || '0.7');
      setLocalVolume(initVolume);
      lastVolumeRef.current = initVolume;
      isInitializedRef.current = true;
    }
  }, [currentVolume]);

  useEffect(() => {
    if (isInitializedRef.current && currentVolume > 0 && !muted) {
      setLocalVolume(currentVolume);
    }
  }, [currentVolume, muted]);

  const VolumeIcon = muted ? HiSpeakerXMark : HiSpeakerWave;

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(lastVolumeRef.current);
      setLocalVolume(lastVolumeRef.current);
    } else {
      setMuted(true);
      lastVolumeRef.current = localVolume;
      setVolume(0);
    }
  };

  const handleVolumeChange = useCallback((value: number) => {
    lastVolumeRef.current = value;
    setLocalVolume(value);
    setVolume(value);
    localStorage.setItem('player-volume', String(value));
  }, [setVolume]);

  const displayValue = muted ? lastVolumeRef.current : localVolume;

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
          step={0.01}
          value={displayValue}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
