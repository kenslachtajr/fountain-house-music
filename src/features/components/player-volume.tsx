import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { Slider } from '~/components/ui/slider';
import { TimeLabel } from './player-time-label';

export function PlayerVolume() {
  // !: muted is not a boolean, it's howler instance at times.
  // !: https://github.com/E-Kuerschner/useAudioPlayer/issues/141
  const { mute, muted, setVolume, volume } = useGlobalAudioPlayer();
  const VolumeIcon = muted ? HiSpeakerXMark : HiSpeakerWave;

  return (
    <div className="justify-end hidden w-full pr-2 md:flex">
      <div className="flex items-center w-3/5 gap-x-4">
        <TimeLabel />
        <VolumeIcon
          className="cursor-pointer w-9 h-9"
          size={34}
          onClick={() => mute(!muted)}
        />
        <Slider
          max={1}
          step={0.1}
          defaultValue={[1]}
          value={[muted ? 0 : volume]}
          onValueChange={([value]) => setVolume(value)}
        />
      </div>
    </div>
  );
}
