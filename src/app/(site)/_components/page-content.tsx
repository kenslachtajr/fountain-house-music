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

  //  const sortedAlbums = [...albums].sort((a, b) => 
  //   new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  // );

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onPlayAlbum={() => {
            // Override the order with the desired order
            // const overriddenOrder = album.songs.map(song => song.song_order);

            const sortedSongs = album.songs.sort((a, b) => 
              (a.order || 0) - (b.order || 0)
            );
            setSongs(sortedSongs);
            setCurrentSong(sortedSongs[0]);
          }}
        />
      ))}
    </div>
  );
};
