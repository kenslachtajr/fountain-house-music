'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import MediaItem from '~/components/MediaItem';
import { useSetSongsToState } from '~/features/player/hooks/use-set-songs-to-state';
import { usePlayerSongsSelect } from '~/features/player/store/player.store';
import { useCurrentUserFromStore } from '~/store/current-user';
import { Song } from '~/types/types';

interface LikedContentProps {
  songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({ songs: likedSongs }) => {
  const user = useCurrentUserFromStore();
  const router = useRouter();

  const songs = usePlayerSongsSelect();

  useSetSongsToState(likedSongs);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col w-full px-6 gap-y-2 text-neutral-400">
        No liked songs.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6 gap-y-2">
      {songs.map((song) => (
        <MediaItem key={song.id} data={song} />
      ))}
    </div>
  );
};

export default LikedContent;
