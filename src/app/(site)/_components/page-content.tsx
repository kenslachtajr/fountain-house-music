'use client';

import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { Album } from '~/types/types';
import { AlbumCard } from './album-card';

interface PageContentProps {
  albums: Album[];
}

export const PageContent: React.FC<PageContentProps> = ({ albums }) => {
  const { setCurrentSong, setSongs } = usePlayerStoreActions();

  if (albums.length === 0) {
    return <div className="mt-4 text-neutral-400">No albums available.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onPlayAlbum={() => {
            setSongs(album.songs);
            setCurrentSong(album.songs[0]);
          }}
        />
      ))}
    </div>
  );
};
