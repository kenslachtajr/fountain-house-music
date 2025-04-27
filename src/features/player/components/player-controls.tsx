import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiPause, HiPlay } from 'react-icons/hi';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { usePlayerStoreActions } from '../store/player.store';

export function PlayerControls() {
  const { getPosition, seek } = useAudioPlayerContext();
  const { nextSong, previousSong } = usePlayerStoreActions();

  const handlePreviousSong = () => {
    const position = getPosition();

    if (position > 10) {
      seek(0);
      return;
    }

    previousSong();
  };

  return (
    <>
      {/* Mobile controls */}
      <div className="flex items-center justify-end w-full col-auto md:hidden">
        <PlayIcon />
      </div>

      {/* Desktop controls */}
      <div className="hidden h-full w-full max-w-[722px] items-center justify-center gap-x-6 md:flex">
        <button
          aria-label="navigate to previous song"
          onClick={handlePreviousSong}
        >
          <AiFillStepBackward
            size={30}
            className="transition cursor-pointer text-neutral-400 hover:text-white"
          />
        </button>
        <PlayIcon />
        <button aria-label="navigate to next song" onClick={nextSong}>
          <AiFillStepForward
            size={30}
            className="transition cursor-pointer text-neutral-400 hover:text-white"
          />
        </button>
      </div>
    </>
  );
}

function PlayIcon() {
  const { pause, play, isPlaying } = useAudioPlayerContext();
  const Icon = isPlaying ? HiPause : HiPlay;

  return (
    <button
      aria-label="control play and pause button"
      onClick={() => (isPlaying ? pause() : play())}
    >
      <Icon size={50} />
    </button>
  );
}
