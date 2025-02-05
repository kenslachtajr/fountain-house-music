import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '~/types/supabase';
import { Album, SupaAlbumWithSongs } from '~/types/types';
import { convertToAlbum } from './get-albums';

export const getAlbum = async (id: string): Promise<Album | null> => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .eq('id', id)
    .returns<SupaAlbumWithSongs[]>()
    .single();

  if (error) {
    console.log(error);
  }

  if (!data) return null;

  return {
    ...convertToAlbum(data),
    // songs: data.songs.sort((a, b) => a.created_at.localeCompare(b.created_at)),
  };
};
