import { Header } from '~/components/header';
import { getAlbums } from '~/server/actions/album/get-albums';
import { ListItem } from './_components/list-item';
import { PageContent } from './_components/page-content';

export const revalidate = 0;

export default async function Home() {
  const albums = await getAlbums();

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header>
        <div className="mb-2">
          <h1 className="text-3xl font-semibold text-white">
            Fountain House Music
          </h1>
          <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <ListItem
              image="/images/liked.jpeg"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="px-6 mt-2 mb-7">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Newest Albums!</h1>
        </div>
        <PageContent albums={albums} />
      </div>
    </div>
  );
}
