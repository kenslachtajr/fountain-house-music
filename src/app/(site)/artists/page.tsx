import { Header } from '~/components/app-header';
import { getArtists } from '~/server/queries/artists/get-artists';
import { ArtistsContent } from '../_components/artists-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header>
        <div className="mb-2 mt-20">
          <h1 className="text-3xl font-semibold text-white">Artists</h1>
        </div>
      </Header>
      <div className="mb-7 mt-2 px-6">
        <ArtistsContent artists={artists} />
      </div>
    </div>
  );
}
