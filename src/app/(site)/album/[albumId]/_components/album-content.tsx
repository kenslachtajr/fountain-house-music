'use client';

import { LikeButton } from '~/components/like-button';
import { useSetSongsToState } from '~/features/player/hooks/use-set-songs-to-state';
import { usePlayerStoreActions } from '~/features/player/store/player.store';
import { Song } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';

interface AlbumContentProps {
  songs: Song[];
}

export function AlbumContent({ songs }: AlbumContentProps) {
  useSetSongsToState(songs);

  return (
    <div className="flex flex-col w-full p-6 gap-y-2">
      {songs.map((song) => (
        <AlbumItem key={song.id} song={song} />
      ))}
    </div>
  );
}

interface AlbumItemProps {
  song: Song;
}

function AlbumItem({ song }: AlbumItemProps) {
  const { setCurrentSong } = usePlayerStoreActions();

  return (
    <div className="flex items-center w-full gap-x-4">
      <div
        onClick={() => setCurrentSong(song)}
        className="flex items-center justify-between w-full p-2 rounded-md cursor-pointer gap-x-3 hover:bg-neutral-800/50"
      >
        <div className="flex flex-col overflow-hidden gap-y-1">
          <p className="text-white truncate">{song.title}</p>
          <p className="text-sm truncate text-neutral-400">{song.author}</p>
        </div>
        <p className="text-sm truncate text-neutral-400">
          {formatDuration(song.duration ?? 0)}
        </p>
      </div>
      <LikeButton songId={song.id} />
    </div>
  );
}
