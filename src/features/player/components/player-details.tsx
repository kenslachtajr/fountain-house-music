'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useLoadImage } from '~/hooks/use-load-image';
import { usePlayerCurrentSongSelect } from '../store/player.store';
import { toggleDebugMode } from './media-session-debug';

// A home-screen PWA icon opens in a storage context separate from Safari
// (no shared localStorage even for the same site), so ?debug=media typed
// into Safari's address bar never reaches the installed app. Tapping the
// artwork 5 times within 2s toggles debug mode directly inside that
// context instead, with no address bar needed.
const DEBUG_TAP_COUNT = 5;
const DEBUG_TAP_WINDOW_MS = 2000;

export function PlayerDetails() {
  const [isLiked, setIsLiked] = useState(false);

  const currentSong = usePlayerCurrentSongSelect();
  const imagePath = useLoadImage(currentSong);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleArtworkTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, DEBUG_TAP_WINDOW_MS);

    if (tapCountRef.current >= DEBUG_TAP_COUNT) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      toggleDebugMode();
    }
  };

  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-x-4">
        {/* Media item */}
        <div className="flex w-full max-w-96 cursor-pointer items-center gap-x-3 rounded-md p-2 hover:bg-neutral-800/50 max-md:max-w-72">
          <div
            className="relative min-h-12 min-w-12 overflow-hidden rounded-md"
            onClick={handleArtworkTap}
          >
            {imagePath && (
              <Image
                fill
                src={imagePath}
                alt="Media item"
                className="object-cover"
                sizes="48px"
              />
            )}
          </div>
          <div className="flex flex-col gap-y-1 overflow-hidden">
            <p className="truncate text-white">{currentSong?.title}</p>
            <p className="truncate text-sm text-neutral-400">
              {currentSong?.author}
            </p>
          </div>
        </div>

        {/* Like button */}
        {/* <button
          onClick={() => setIsLiked(!isLiked)}
          className="transition hover:opacity-75"
        >
          <Icon color={isLiked ? '#0096FF' : 'white'} size={25} />
        </button> */}
      </div>
    </div>
  );
}
