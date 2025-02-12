'use server';

import { Song } from '~/types/types';
import { createClient } from '~/utils/supabase/server';
import { getCurrentUserAuth } from '../user/get-current-user-auth';

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = await createClient();

  const authenticatedUser = await getCurrentUserAuth();

  if (!authenticatedUser) {
    return [];
  }

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', authenticatedUser?.id!)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};
