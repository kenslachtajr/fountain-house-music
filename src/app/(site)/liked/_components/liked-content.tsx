'use client';

import { MediaItem } from '~/components/media-item';
import { useSetSongsToState } from '~/features/player/hooks/use-set-songs-to-state';
import { usePlayerSongsSelect } from '~/features/player/store/player.store';
import { Song } from '~/types/types';

interface LikedContentProps {
  songs: Song[];
}

export const LikedContent: React.FC<LikedContentProps> = ({
  songs: likedSongs,
}) => {
  const songs = usePlayerSongsSelect();

  useSetSongsToState(likedSongs);

  if (songs.length === 0) {
    return (
      <div className="flex w-full flex-col gap-y-2 px-6 text-center text-neutral-400">
        No liked songs.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-2 p-6">
      {songs.map((song) => (
        <MediaItem key={song.id} data={song} />
      ))}
    </div>
  );
};
