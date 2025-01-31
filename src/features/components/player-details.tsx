'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import useLoadImage from '~/hooks/useLoadImage';
import { usePlayerStore } from '../store/player.store';

export function PlayerDetails() {
  const [isLiked, setIsLiked] = useState(false);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const imagePath = useLoadImage(currentSong);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <div className="flex justify-start w-full">
      <div className="flex items-center gap-x-4">
        {/* Media item */}
        <div className="flex items-center w-full p-2 rounded-md cursor-pointer gap-x-3 hover:bg-neutral-800/50">
          <div className="relative overflow-hidden rounded-md min-h-12 min-w-12">
            <Image
              fill
              src={imagePath ?? ''}
              alt="Media item"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden gap-y-1">
            <p className="text-white truncate">{currentSong?.title}</p>
            <p className="text-sm truncate text-neutral-400">
              {currentSong?.author}
            </p>
          </div>
        </div>

        {/* Like button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="transition hover:opacity-75"
        >
          <Icon color={isLiked ? '#0096FF' : 'white'} size={25} />
        </button>
      </div>
    </div>
  );
}
