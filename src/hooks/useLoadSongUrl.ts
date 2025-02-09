import { Song } from '~/types/types';
import { createClient } from '~/utils/supabase/client';

const useLoadSongUrl = (song?: Song) => {
  const supabaseClient = createClient();

  if (!song?.song_path) {
    return '';
  }

  const { data: songData } = supabaseClient.storage
    .from('songs')
    .getPublicUrl(song.song_path);

  return songData.publicUrl;
};

export default useLoadSongUrl;
