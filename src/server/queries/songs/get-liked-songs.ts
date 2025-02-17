import { withAuth } from '~/server/with-auth';
import { Song } from '~/types/types';

export const getLikedSongs = () => {
  return withAuth(async (supabase, user): Promise<Song[]> => {
    if (!user?.id) {
      return [];
    }

    const { data, error } = await supabase
      .from('liked_songs')
      .select('*, songs(*)')
      .eq('user_id', user.id)
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
  });
};
