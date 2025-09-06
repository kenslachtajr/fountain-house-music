'use client';

import Image from 'next/image';

import { usePlayerStoreActions, usePlayerCurrentSongSelect } from '~/features/player/store/player.store';
import { useLoadImage } from '~/hooks/use-load-image';
import { Song } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';
import { LikeButton } from './like-button';

interface MediaItemProps {
  data: Song;
}

export const MediaItem: React.FC<MediaItemProps> = ({ data }) => {
  const { setCurrentSong } = usePlayerStoreActions();
  const currentSong = usePlayerCurrentSongSelect();
  const imageUrl = useLoadImage(data);
  const isPlaying = currentSong?.id === data.id;

  return (
    <div className="flex w-full items-center gap-x-4">
      <div
        onClick={() => setCurrentSong(data)}
        className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-800/50"
      >
        <div className="flex gap-3 overflow-hidden">
          <div className="relative min-h-[48px] min-w-[48px] overflow-hidden rounded-md">
            <Image
              fill
              src={imageUrl || '/images/placeholder.jpeg'}
              alt="Media item"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="truncate text-white">{data.title}</p>
              {isPlaying && (
                <span className="inline-block h-4 w-4">
                  <span className="flex h-full items-end gap-[1.5px]">
                    <span className="w-[2px] h-2 animate-bar1 rounded-sm" />
                    <span className="w-[2px] h-3 animate-bar2 rounded-sm" />
                    <span className="w-[2px] h-4 animate-bar3 rounded-sm" />
                  </span>
                </span>
              )}
            </div>
            <p className="truncate text-sm text-neutral-400">{data.author}</p>
          </div>
        </div>
        <MediaItemDuration duration={data.duration} />
      </div>
      <LikeButton songId={data.id} />
    </div>
  );
};

function MediaItemDuration({ duration }: { duration: number | null }) {
  if (!duration) return;
  return (
    <p className="truncate text-sm text-neutral-400">
      {formatDuration(duration)}
    </p>
  );
}
