import { Header } from '~/components/app-header';
import { Album } from '~/types/types';
import { formatDate } from '~/utils/format-date';
import { AlbumImage } from './album-image';

export function AlbumHeader({ album }: { album: Album }) {
  const releaseDate = formatDate(album?.release_date!);
  return (
    <Header>
      <div className="mt-20 flex flex-col items-center gap-x-5 text-center md:flex-row md:text-left">
        <AlbumImage album={album} />
        <div className="mt-4 flex flex-col gap-y-2 md:mt-0">
          <p className="hidden text-sm font-semibold md:block">Album</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {album?.name}
          </h1>
          <div className="text-sm text-gray-300 flex flex-col md:flex-row md:gap-x-2">
            <span>{album.author}</span>
            <span className="hidden md:inline">&middot;</span>
            <span>{releaseDate}</span>
            <span className="hidden md:inline">&middot;</span>
            <span>
              {album.songs_count} {album.songs_count === 1 ? 'song' : 'songs'},{' '}
              {album.readable_duration}
            </span>
          </div>
        </div>
      </div>
    </Header>
  );
}
