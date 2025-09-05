import { AlbumSongs } from '~/types/schemas';
import { createClient } from '~/utils/supabase/server';
import { convertToAlbum } from './converter';

export const getAlbums = async () => {
  const supabase = await createClient();

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('release_date', { ascending: false })
    .returns<AlbumSongs[]>();

  if (error) {
    console.log(error);
  }

  return (albums || []).map(convertToAlbum);
};
