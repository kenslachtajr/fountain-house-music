import { notFound } from 'next/navigation';
import { getAlbumAction } from '~/server/actions/album/get-album';
import { AlbumContent } from './_components/album-content';
import { AlbumHeader } from './_components/album-header';

interface AlbumProps {
  params: Promise<{
    albumId: string;
  }>;
}

export const revalidate = 0;

export default async function AlbumPage(props: AlbumProps) {
  const params = await props.params;
  const album = await getAlbumAction(params.albumId);

  if (!album) {
    notFound();
  }

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <AlbumHeader album={album} />
      <AlbumContent songs={album.songs} />
    </div>
  );
}
