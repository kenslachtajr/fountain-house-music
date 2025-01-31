import { create } from 'zustand';
import { Song } from '~/types/types';

interface PlayerStore {
  songs: Song[];
  currentSong?: Song;
  setSongs: (songs: Song[]) => void;
  setCurrentSong: (song: Song) => void;
  nextSong: () => void;
  previousSong: () => void;
}

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  songs: [],
  setSongs: (songs: Song[]) => set({ songs }),
  setCurrentSong: (song: Song) => set({ currentSong: song }),
  nextSong: () => {
    const { currentSong, songs } = get();

    // Don't allow going to next song if we're at the last song
    if (!currentSong || songs.indexOf(currentSong) === songs.length - 1) return;

    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    set({ currentSong: songs.at(currentIndex + 1) });
  },
  previousSong: () => {
    const { currentSong, songs } = get();

    // Don't allow going to previous song if we're at the first song
    if (!currentSong || songs.indexOf(currentSong) === 0) return;

    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    set({ currentSong: songs.at(currentIndex - 1) });
  },
}));
