'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useLoadImage } from '~/hooks/use-load-image';
import { usePlayerCurrentSongSelect } from '../store/player.store';

export function PlayerDetails() {
  const [isLiked, setIsLiked] = useState(false);

  const currentSong = usePlayerCurrentSongSelect();
  const imagePath = useLoadImage(currentSong);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-x-4">
        {/* Media item */}
        <div className="flex items-center w-full p-2 rounded-md cursor-pointer gap-x-3 hover:bg-neutral-800/50 max-md:max-w-72 max-w-96">
          <div className="relative min-h-12 min-w-12 overflow-hidden rounded-md">
            <Image
              fill
              src={imagePath ?? ''}
              alt="Media item"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-1 overflow-hidden">
            <p className="truncate text-white">{currentSong?.title}</p>
            <p className="truncate text-sm text-neutral-400">
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
