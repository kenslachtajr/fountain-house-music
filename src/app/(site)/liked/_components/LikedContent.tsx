'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import LikeButton from '~/components/LikeButton';
import MediaItem from '~/components/MediaItem';
import { useSetSongsToState } from '~/features/hooks/use-set-songs-to-state';
import {
  usePlayerSongsSelect,
  usePlayerStoreActions,
} from '~/features/store/player.store';
import { useUser } from '~/hooks/useUser';
import { Song } from '~/types/types';

interface LikedContentProps {
  songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({ songs: likedSongs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const { setCurrentSong } = usePlayerStoreActions();
  const songs = usePlayerSongsSelect();

  useSetSongsToState(likedSongs);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

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

export default LikedContent;
