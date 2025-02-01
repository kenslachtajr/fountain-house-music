'use client';

import LikeButton from '~/components/LikeButton';
import MediaItem from '~/components/MediaItem';
import { useSetSongsToState } from '~/features/player/hooks/use-set-songs-to-state';
import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { Song } from '~/types/types';

interface AlbumContentProps {
  songs: Song[];
}

export function AlbumContent({ songs }: AlbumContentProps) {
  const { setCurrentSong } = usePlayerStoreActions();

  useSetSongsToState(songs);

  return (
    <div className="flex flex-col w-full p-6 gap-y-2">
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
}
