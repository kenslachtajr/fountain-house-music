'use client';

import MediaItem from '~/components/MediaItem';
import { Song } from '~/types/types';

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col w-full px-6 text-center gap-y-2 text-neutral-400">
        No songs found!
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 gap-y-2">
      {songs.map((song) => (
        <MediaItem key={song.id} data={song} />
      ))}
    </div>
  );
};

export default SearchContent;
