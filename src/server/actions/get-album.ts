import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupaAlbum } from '~/types/types';
import { convertToAlbum } from './get-albums';

export const getAlbum = async (id: string) => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .eq('id', id)
    .returns<SupaAlbum[]>()
    .single();

  if (error) {
    console.log(error);
  }

  if (!data) return null;

  return convertToAlbum(data);
};
