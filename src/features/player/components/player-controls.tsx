import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { usePlayerStoreActions } from '../store/player.store';
import { HiPause, HiPlay } from 'react-icons/hi';

export function PlayerControls() {
  const { getPosition, seek } = useGlobalAudioPlayer();
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
      <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <button aria-label="navigate to previous song" onClick={handlePreviousSong}>
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
  const { pause, play, playing } = useGlobalAudioPlayer();
  const Icon = playing ? HiPause : HiPlay;

  return (
    <button aria-label="control play and pause button" onClick={() => (playing ? pause() : play())}>
      <Icon size={50} />
    </button>
  );
}
