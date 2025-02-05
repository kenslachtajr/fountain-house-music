import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '~/types/supabase';
import { Album, SupaAlbumWithSongs } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';

export const getAlbums = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const { data: albums, error } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .order('release_date', { ascending: true })
    .returns<SupaAlbumWithSongs[]>();

  if (error) {
    console.log(error);
  }

  return (albums || []).map(convertToAlbum);
};

export function convertToAlbum(album: SupaAlbumWithSongs): Album {
  const duration = album.songs.reduce(
    (acc, song) => acc + (song.duration ?? 0),
    0,
  );

  return {
    ...album,
    duration: formatDuration(duration),
    readable_duration: formatDuration(duration, true),
    songs_count: album.songs?.length || 0,
  };
}
