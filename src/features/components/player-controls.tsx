import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { usePlayerStore } from '../store/player.store';

export function PlayerControls() {
  const { nextSong, previousSong } = usePlayerStore();
  const { getPosition, seek } = useGlobalAudioPlayer();

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
        <AiFillStepBackward
          onClick={handlePreviousSong}
          size={30}
          className="transition cursor-pointer text-neutral-400 hover:text-white"
        />
        <PlayIcon />
        <AiFillStepForward
          onClick={nextSong}
          size={30}
          className="transition cursor-pointer text-neutral-400 hover:text-white"
        />
      </div>
    </>
  );
}

function PlayIcon() {
  const { pause, play, playing } = useGlobalAudioPlayer();
  const Icon = playing ? BsPauseFill : BsPlayFill;

  return (
    <div className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-full cursor-pointer ">
      <Icon
        onClick={() => (playing ? pause() : play())}
        size={30}
        className="text-black"
      />
    </div>
  );
}
