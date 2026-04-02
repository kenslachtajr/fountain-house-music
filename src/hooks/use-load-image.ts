'use client';

import { useMemo } from 'react';
import { Album, Song } from '~/types/types';
import { createClient } from '~/utils/supabase/client';

let cachedClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!cachedClient) {
    cachedClient = createClient();
  }
  return cachedClient;
}

export const useLoadImage = (song?: Album | Song) => {
  const imagePath = song?.image_path;

  return useMemo(() => {
    if (!imagePath) {
      return null;
    }

    const supabaseClient = getSupabaseClient();
    const { data: imageData } = supabaseClient.storage
      .from('images')
      .getPublicUrl(imagePath);

    return imageData.publicUrl;
  }, [imagePath]);
};
