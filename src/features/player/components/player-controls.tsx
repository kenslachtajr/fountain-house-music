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
      <div className="col-auto flex w-full items-center justify-end md:hidden">
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
            className="cursor-pointer text-neutral-400 transition hover:text-white"
          />
        </button>
        <PlayIcon />
        <button aria-label="navigate to next song" onClick={nextSong}>
          <AiFillStepForward
            size={30}
            className="cursor-pointer text-neutral-400 transition hover:text-white"
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
    <button
      aria-label="control play and pause button"
      onClick={() => (playing ? pause() : play())}
    >
      <Icon size={50} />
    </button>
  );
}
