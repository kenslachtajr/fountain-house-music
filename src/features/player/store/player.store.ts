import { useAudioPlayerContext } from 'react-use-audio-player';
import { create } from 'zustand';
import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useSubscribeDialogActions } from '~/features/subscribe/stores/use-subscribe-dialog';
import { Song } from '~/types/types';

interface PlayerStore {
  songs: Song[];
  currentSong?: Song;
  actions: {
    nextSong: () => void;
    previousSong: () => void;
    setSongs: (songs: Song[]) => void;
    setCurrentSong: (song: Song) => void;
    reset: () => void;
  };
}

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  songs: [],
  actions: {
    setSongs: (songs: Song[]) => set({ songs }),
    setCurrentSong: (song: Song) => set({ currentSong: song }),
    nextSong: () => {
      const { currentSong, songs } = get();

      // Don't allow going to next song if we're at the last song
      if (!currentSong || songs.indexOf(currentSong) === songs.length - 1)
        return;

      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong?.id,
      );
      set({ currentSong: songs.at(currentIndex + 1) });
    },
    previousSong: () => {
      const { currentSong, songs } = get();

      // Don't allow going to previous song if we're at the first song
      if (!currentSong || songs.indexOf(currentSong) === 0) return;

      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong?.id,
      );
      set({ currentSong: songs.at(currentIndex - 1) });
    },
    reset: () => {
      set({ currentSong: undefined, songs: [] });
    },
  },
}));

export const usePlayerCurrentSongSelect = () =>
  usePlayerStore((state) => state.currentSong);

export const usePlayerSongsSelect = () =>
  usePlayerStore((state) => state.songs);

export const usePlayerStoreActions = () => {
  const user = useCurrentUserSelect();
  const { stop } = useAudioPlayerContext();
  const { openDialogTo: openAuthenticationDialogTo } =
    useAuthenticationDialogActions();
  const { openDialog: openSubscribeDialog } = useSubscribeDialogActions();
  const { setCurrentSong, reset, ...actions } = usePlayerStore(
    (state) => state.actions,
  );

  const handleCurrentSong = (song: Song) => {
    if (!user) {
      openAuthenticationDialogTo('sign-in');
      return;
    }

    if (!user.subscription) {
      openSubscribeDialog();
      return;
    }

    setCurrentSong(song);
  };

  const handleReset = () => {
    stop();
    reset();
  };

  return {
    ...actions,
    setCurrentSong: handleCurrentSong,
    reset: handleReset,
  };
};
