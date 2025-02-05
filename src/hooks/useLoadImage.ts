import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Album, Song } from '~/types/types';

const useLoadImage = (song?: Album | Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song?.image_path) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from('images')
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
