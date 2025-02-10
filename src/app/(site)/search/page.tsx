import Header from '~/components/Header';
import { getSongsByTitleOrAuthor } from '~/server/actions/songs/get-songs-by-title-or-author';
import SearchInput from './_components/search-input';
import SearchContent from './_components/SearchContent';

interface SearchProps {
  searchParams: Promise<{
    title?: string;
    author?: string | null;
  }>;
}
export const revalidate = 0;

export default async function Search(props: SearchProps) {
  const searchParams = await props.searchParams;
  let songs: any[] = [];

  if (searchParams.title) {
    songs = await getSongsByTitleOrAuthor(searchParams.title);
  } else if (searchParams.author) {
    songs = await getSongsByTitleOrAuthor(searchParams.author || '');
  }

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header className="from-bg-neutral-900">
        <div className="flex flex-col mb-2 gap-y-6">
          <h1 className="text-3xl font-semibold text-white">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
}
