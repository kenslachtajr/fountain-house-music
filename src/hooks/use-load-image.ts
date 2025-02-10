import { Album, Song } from '~/types/types';
import { createClient } from '~/utils/supabase/client';

export const useLoadImage = (song?: Album | Song) => {
  const supabaseClient = createClient();

  if (!song?.image_path) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from('images')
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};
