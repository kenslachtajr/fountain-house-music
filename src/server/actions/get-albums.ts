import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '~/types/supabase';
import { Album, SupaAlbumWithSongs } from '~/types/types';

export const getAlbums = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('created_at', { ascending: true })
    .returns<SupaAlbumWithSongs[]>();

  if (error) {
    console.log(error);
  }

  return (albums || []).map(convertToAlbum);
};

export function convertToAlbum(album: SupaAlbumWithSongs): Album {
  return {
    ...album,
    duration: album.songs.reduce((acc, song) => acc + (song.duration ?? 0), 0),
    songs_count: album.songs?.length || 0,
  };
}
