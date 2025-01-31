'use client';

import LikeButton from '~/components/LikeButton';
import MediaItem from '~/components/MediaItem';
import { usePlayerStore } from '~/features/store/player.store';
import { Song } from '~/types/types';

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const { setCurrentSong } = usePlayerStore();

  if (songs.length === 0) {
    return (
      <div className="flex flex-col w-full px-6 gap-y-2 text-neutral-400">
        No songs found!
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 gap-y-2">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center w-full gap-x-4">
          <div className="flex-1">
            <MediaItem onClick={setCurrentSong} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
