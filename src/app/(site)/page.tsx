import { getAlbums } from '~/server/queries/album/get-albums';
import { getArtists } from '~/server/queries/artists/get-artists';
import { ArtistsContent } from './_components/artists-content';
import { HomeHeader } from './_components/home-header';
import { PageContent } from './_components/page-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [albums, artists] = await Promise.all([getAlbums(), getArtists()]);

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <HomeHeader />
      <div className="mb-7 mt-2 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Albums</h1>
        </div>
        <PageContent albums={albums} />
      </div>
      <div className="mb-7 mt-2 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Artists</h1>
        </div>
        <ArtistsContent artists={artists} />
      </div>
    </div>
  );
}
