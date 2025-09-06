'use client';

import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { Album } from '~/types/types';
import { AlbumCard } from './album-card';

interface PageContentProps {
  albums: Album[];
}

export const PageContent: React.FC<PageContentProps> = ({ albums }) => {
  const { setCurrentSong, setSongs } = usePlayerStoreActions();

  // Helper to sort songs by track number (assumes track number is at start of title)
  function sortSongsByTrack(songs: any[]) {
    return [...songs].sort((a, b) => {
      const getTrackNum = (title: string) => parseInt((title ?? '').trim().split(' ')[0], 10) || 0;
      return getTrackNum(a.title ?? '') - getTrackNum(b.title ?? '');
    });
  }

  if (albums.length === 0) {
    return <div className="mt-4 text-neutral-400">No albums available.</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {albums.map((album) => {
        const sortedSongs = sortSongsByTrack(album.songs);
        return (
          <AlbumCard
            key={album.id}
            album={{ ...album, songs: sortedSongs }}
            onPlayAlbum={() => {
              setSongs(sortedSongs);
              setCurrentSong(sortedSongs[0]);
            }}
          />
        );
      })}
    </div>
  );
};
