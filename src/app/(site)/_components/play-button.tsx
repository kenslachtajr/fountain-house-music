'use client';

import { FaPlay } from 'react-icons/fa';
import { useTheme } from '~/features/layout/components/theme-context';

export const PlayButton = () => {
  const { primaryColor } = useTheme();
  
  return (
    <button 
      className="translate flex translate-y-1/4 items-center rounded-full p-4 opacity-0 drop-shadow-md transition hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
      style={{ backgroundColor: primaryColor }}
    >
      <FaPlay className="text-black" />
    </button>
  );
};
