import { createClient } from '~/utils/supabase/server';

export type ArtistSummary = {
  name: string;
  song_count: number;
  image_path: string | null;
};

export const getArtists = async (): Promise<ArtistSummary[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('author, image_path')
    .not('author', 'is', null);

  if (error) {
    console.log(error);
    return [];
  }

  const artistMap = new Map<string, ArtistSummary>();

  for (const song of data || []) {
    if (!song.author) continue;

    if (!artistMap.has(song.author)) {
      artistMap.set(song.author, {
        name: song.author,
        song_count: 1,
        image_path: song.image_path,
      });
    } else {
      artistMap.get(song.author)!.song_count += 1;
    }
  }

  return Array.from(artistMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};
