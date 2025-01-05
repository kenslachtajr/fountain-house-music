import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getAlbums } from '../api/albums/albumApi'


const getSongsByTitleOrAuthor = async (
  searchTerm: string
): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }

  return data as Song[];
};

export default getSongsByTitleOrAuthor;