import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Album, SupaAlbum } from '~/types/types';

export const getAlbums = async () => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('created_at', { ascending: true })
    .returns<SupaAlbum[]>();

  if (error) {
    console.log(error);
  }

  return (albums || []).map(convertToAlbum);
};

function convertToAlbum(album: SupaAlbum): Album {
  return {
    ...album,
    duration: album.songs.reduce((acc, song) => acc + song.duration, 0),
    songs_count: album.songs?.length || 0,
  };
}
