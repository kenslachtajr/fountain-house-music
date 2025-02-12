import { Album, SupaAlbumWithSongs } from '~/types/types';
import { formatDuration } from '~/utils/format-duration';

export function convertToAlbum(album: SupaAlbumWithSongs): Album {
  const duration = album.songs.reduce(
    (acc, song) => acc + (song.duration ?? 0),
    0,
  );

  return {
    ...album,
    duration: formatDuration(duration),
    readable_duration: formatDuration(duration, true),
    songs_count: album.songs?.length || 0,
  };
}
