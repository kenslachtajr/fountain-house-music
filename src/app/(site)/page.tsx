import { getAlbums } from '~/server/queries/album/get-albums';
import { HomeHeader } from './_components/home-header';
import { PageContent } from './_components/page-content';

export const revalidate = 0;

export default async function Home() {
  const albums = await getAlbums();

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <HomeHeader />
      <div className="mb-7 mt-2 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Newest Albums!</h1>
        </div>
        <PageContent albums={albums} />
      </div>
    </div>
  );
}
