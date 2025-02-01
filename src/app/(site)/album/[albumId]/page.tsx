import { notFound } from 'next/navigation';
import Header from '~/components/Header';
import { getAlbum } from '~/server/actions/get-album';
import { AlbumContent } from './_components/album-content';
import { AlbumImage } from './_components/album-image';

interface AlbumProps {
  params: {
    albumId: string;
  };
}

export const revalidate = 0;

export default async function Album({ params }: AlbumProps) {
  const album = await getAlbum(params.albumId);

  if (!album) {
    notFound();
  }

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col items-center md:flew-row gap-x-5">
            <AlbumImage album={album} />
            <div className="flex flex-col mt-4 gap-y-2 md:mt-0">
              <p className="hidden text-sm font-semibold md:block">Album</p>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
                {album?.name}
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <AlbumContent songs={album.songs} />
    </div>
  );
}
