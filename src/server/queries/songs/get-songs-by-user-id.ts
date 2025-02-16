import { withAuth } from '~/server/with-auth';
import { Song } from '~/types/types';

export const getSongsByUserId = () => {
  return withAuth(async (supabase, user) => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error.message);
    }

    return (data || []) as Song[];
  });
};
