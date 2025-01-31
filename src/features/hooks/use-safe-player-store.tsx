import useAuthModal from '~/hooks/useAuthModal';
import { useUser } from '~/hooks/useUser';

import { Song } from '~/types/types';
import { usePlayerStore } from '../store/player.store';

export const useSafePlayerStore = () => {
  const { setCurrentSong, ...store } = usePlayerStore();
  const authModal = useAuthModal();
  const { user } = useUser();

  const handleCurrentSong = (song: Song) => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    setCurrentSong(song);
  };

  return {
    ...store,
    setCurrentSong: handleCurrentSong,
  };
};
