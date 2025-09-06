import { useEffect } from 'react';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiPause, HiPlay } from 'react-icons/hi';
import { useAudioPlayerContext } from 'react-use-audio-player';
import { usePlayerStoreActions } from '../store/player.store';
import { useIdleTimer } from '../hooks/use-idle-timer';

// Accept onPlay prop to trigger audio load/play on user gesture
export function PlayerControls({ onPlay }: { onPlay?: () => void }) {
  const { getPosition, seek, pause, isPlaying } = useAudioPlayerContext();
  const { nextSong, previousSong } = usePlayerStoreActions();

  useIdleTimer(() => {
    if (isPlaying) pause();
  }, 15 * 60 * 1000);

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
      <div className="flex items-center justify-center w-full col-auto gap-x-6 md:hidden">
        <button
          aria-label="navigate to previous song"
          onClick={handlePreviousSong}
        >
          <AiFillStepBackward
            size={30}
            className="transition cursor-pointer text-neutral-400 hover:text-white"
          />
        </button>
  <PlayIcon onPlay={onPlay} />
        <button
          aria-label="navigate to next song"
          onClick={nextSong}
        >
          <AiFillStepForward
            size={30}
            className="transition cursor-pointer text-neutral-400 hover:text-white"
          />
        </button>
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
  <PlayIcon onPlay={onPlay} />
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

function PlayIcon({ onPlay }: { onPlay?: () => void }) {
  const { pause, play, isPlaying } = useAudioPlayerContext();
  const Icon = isPlaying ? HiPause : HiPlay;

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      if (onPlay) {
        onPlay();
      } else {
        play();
      }
    }
  };

  return (
    <button
      aria-label="control play and pause button"
      onClick={handleClick}
    >
      <Icon size={50} />
    </button>
  );
}