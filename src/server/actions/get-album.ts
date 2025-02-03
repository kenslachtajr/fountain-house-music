import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '~/types/supabase';
import { SupaAlbumWithSongs } from '~/types/types';
import { convertToAlbum } from './get-albums';

export const getAlbum = async (id: string) => {
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

  return convertToAlbum(data);
};
