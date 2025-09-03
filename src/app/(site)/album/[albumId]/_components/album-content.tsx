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
    <div className="flex w-full flex-col gap-y-2 p-6">
      {[...songs]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((song) => (
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
    <div className="flex w-full items-center gap-x-4">
      <div
        onClick={() => setCurrentSong(song)}
        className="flex w-full cursor-pointer items-center justify-between gap-x-3 rounded-md p-2 hover:bg-neutral-800/50"
      >
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <p className="truncate text-white">{song.title}</p>
          <p className="truncate text-sm text-neutral-400">{song.author}</p>
        </div>
        <p className="truncate text-sm text-neutral-400">
          {formatDuration(song.duration ?? 0)}
        </p>
      </div>
      <LikeButton songId={song.id} />
    </div>
  );
}
