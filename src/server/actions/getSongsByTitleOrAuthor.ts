'use server';

import { Song } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

const getSongsByTitleOrAuthor = async (searchTerm: string): Promise<Song[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(20)
    .returns<Song[]>();

  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }

  return data;
};

export default getSongsByTitleOrAuthor;
