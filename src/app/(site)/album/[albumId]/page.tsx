import { notFound } from 'next/navigation';
import Header from '~/components/Header';
import { getAlbum } from '~/server/actions/get-album';
import { Album } from '~/types/types';
import { formatDate } from '~/utils/format-date';
import { AlbumContent } from './_components/album-content';
import { AlbumImage } from './_components/album-image';

interface AlbumProps {
  params: {
    albumId: string;
  };
}

export const revalidate = 0;

export default async function AlbumPage({ params }: AlbumProps) {
  const album = await getAlbum(params.albumId);

  if (!album) {
    notFound();
  }

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <AlbumHeader album={album} />
      <AlbumContent songs={album.songs} />
    </div>
  );
}

function AlbumHeader({ album }: { album: Album }) {
  const releaseDate = formatDate(album?.release_date!);
  return (
    <Header>
      <div className="flex flex-col items-center mt-20 text-center md:text-left md:flex-row gap-x-5">
        <AlbumImage album={album} />
        <div className="flex flex-col mt-4 gap-y-2 md:mt-0">
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
