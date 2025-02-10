'use server';

import { Song } from '~/types/types';
import { createClient } from '~/utils/supabase/server';

const getSongsByUserId = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', user?.id!)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data || []) as Song[];
};

export default getSongsByUserId;
