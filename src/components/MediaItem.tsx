'use client';

import Image from 'next/image';

import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { useLoadImage } from '~/hooks/use-load-image';
import { Song } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';
import LikeButton from './LikeButton';

interface MediaItemProps {
  data: Song;
}

const MediaItem: React.FC<MediaItemProps> = ({ data }) => {
  const { setCurrentSong } = usePlayerStoreActions();
  const imageUrl = useLoadImage(data);

  return (
    <div className="flex items-center w-full gap-x-4">
      <div
        onClick={() => setCurrentSong(data)}
        className="flex items-center justify-between w-full p-2 rounded-md cursor-pointer hover:bg-neutral-800/50"
      >
        <div className="flex gap-3 overflow-hidden">
          <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
            <Image
              fill
              src={imageUrl || '/images/placeholder.jpeg'}
              alt="Media item"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden gap-y-1">
            <p className="text-white truncate">{data.title}</p>
            <p className="text-sm truncate text-neutral-400">{data.author}</p>
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
    <p className="text-sm truncate text-neutral-400">
      {formatDuration(duration)}
    </p>
  );
}

export default MediaItem;
