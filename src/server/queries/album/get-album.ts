import { AlbumSongs } from '~/types/schemas';
import { Album } from '~/types/types';
import { createClient } from '~/utils/supabase/server';
import { convertToAlbum } from './converter';

export const getAlbumAction = async (id: string): Promise<Album | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .eq('id', id)
    .returns<AlbumSongs[]>()
    .single();

  if (error) {
    console.log(error);
  }

  if (!data) return null;

  return convertToAlbum(data);
};
