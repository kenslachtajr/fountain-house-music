import { getAlbums } from '~/server/actions/album/get-albums';
import { HomeHeader } from './_components/home-header';
import { PageContent } from './_components/page-content';

export const revalidate = 0;

export default async function Home() {
  const albums = await getAlbums();

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <HomeHeader />
      <div className="px-6 mt-2 mb-7">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Newest Albums!</h1>
        </div>
        <PageContent albums={albums} />
      </div>
    </div>
  );
}
