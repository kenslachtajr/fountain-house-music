'use client';

import { useEffect } from 'react';
import SongItem from '~/components/SongItem';
import { useSafePlayerStore } from '~/features/hooks/use-safe-player-store';
import { Song } from '~/types/types';

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const { setCurrentSong, setSongs } = useSafePlayerStore();

  useEffect(() => {
    setSongs(songs);
  }, [setSongs, songs]);

  if (songs.length === 0) {
    return <div className="mt-4 text-neutral-400">No songs available.</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
      {songs.map((item) => (
        <SongItem key={item.id} onClick={setCurrentSong} data={item} />
      ))}
    </div>
  );
};

export default PageContent;
