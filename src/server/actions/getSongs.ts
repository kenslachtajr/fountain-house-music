'use server';

import { Song } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

const getSongs = async (): Promise<Song[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.log(error);
  }

  return data || [];
};

export default getSongs;
