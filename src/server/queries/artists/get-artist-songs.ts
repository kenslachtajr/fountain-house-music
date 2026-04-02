import { AlbumSongs } from '~/types/schemas';
import { Album, Song } from '~/types/types';
import { createClient } from '~/utils/supabase/server';
import { convertToAlbum } from '../album/converter';

export const getArtistSongs = async (
  artistName: string,
): Promise<{ songs: Song[]; albums: Album[] }> => {
  const decodedName = decodeURIComponent(artistName);
  const supabase = await createClient();

  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('*')
    .eq('author', decodedName)
    .order('title', { ascending: true })
    .returns<Song[]>();

  if (songsError) {
    console.log(songsError);
  }

  const { data: albumsData, error: albumsError } = await supabase
    .from('albums')
    .select('*, songs(*)')
    .eq('author', decodedName)
    .order('release_date', { ascending: false })
    .returns<AlbumSongs[]>();

  if (albumsError) {
    console.log(albumsError);
  }

  return {
    songs: songs || [],
    albums: (albumsData || []).map(convertToAlbum),
  };
};
