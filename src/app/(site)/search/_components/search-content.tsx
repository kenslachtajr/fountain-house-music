'use client';

import { MediaItem } from '~/components/media-item';
import { Song } from '~/types/types';

interface SearchContentProps {
  songs: Song[];
}

export const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  if (songs.length === 0) {
    return (
      <div className="flex w-full flex-col gap-y-2 px-6 text-center text-neutral-400">
        No songs found!
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-2 px-6">
      {songs.map((song) => (
        <MediaItem key={song.id} data={song} />
      ))}
    </div>
  );
};
