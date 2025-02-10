import { Header } from '~/components/header';
import { Album } from '~/types/types';
import { formatDate } from '~/utils/format-date';
import { AlbumImage } from './album-image';

export function AlbumHeader({ album }: { album: Album }) {
  const releaseDate = formatDate(album?.release_date!);
  return (
    <Header>
      <div className="flex flex-col items-center mt-20 text-center md:text-left md:flex-row gap-x-5">
        <AlbumImage album={album} />
        <div className="flex flex-col mt-4 gap-y-2 md:mt-0">
          <p className="hidden text-sm font-semibold md:block">Album</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
            {album?.name}
          </h1>
          <span className="text-sm text-gray-300">
            {album.author} &middot; {releaseDate} &middot;{' '}
            <AlbumSongCount songs_count={album.songs_count} />,{' '}
            {album.readable_duration}
          </span>
        </div>
      </div>
    </Header>
  );
}

function AlbumSongCount({ songs_count }: { songs_count: number }) {
  if (songs_count === 1) {
    return <span>1 song</span>;
  }

  return <span>{songs_count} songs</span>;
}
