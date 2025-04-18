import { FaPlay } from 'react-icons/fa';

export const PlayButton = () => {
  return (
    <button className="translate flex translate-y-1/4 items-center rounded-full bg-blue-400 p-4 opacity-0 drop-shadow-md transition hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100">
      <FaPlay className="text-black" />
    </button>
  );
};
