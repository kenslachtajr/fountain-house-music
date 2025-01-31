import { useEffect } from 'react';
import { Song } from '~/types/types';
import { usePlayerStoreActions } from '../store/player.store';

export const useSetSongsToState = (songs?: Song[]) => {
  const { setSongs } = usePlayerStoreActions();

  useEffect(() => {
    if (!songs) return;
    setSongs(songs);
  }, [setSongs, songs]);
};
