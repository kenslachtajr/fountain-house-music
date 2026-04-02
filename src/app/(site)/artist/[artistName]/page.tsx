import { notFound } from 'next/navigation';
import { getArtistSongs } from '~/server/queries/artists/get-artist-songs';
import { ArtistContent } from './_components/artist-content';
import { ArtistHeader } from './_components/artist-header';

interface ArtistPageProps {
  params: Promise<{
    artistName: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArtistPage(props: ArtistPageProps) {
  const params = await props.params;
  const artistName = decodeURIComponent(params.artistName);
  const { songs, albums } = await getArtistSongs(params.artistName);

  if (songs.length === 0 && albums.length === 0) {
    notFound();
  }

  const imagePath = songs[0]?.image_path || null;

  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <ArtistHeader
        name={artistName}
        songCount={songs.length}
        albumCount={albums.length}
        imagePath={imagePath}
      />
      <ArtistContent songs={songs} albums={albums} />
    </div>
  );
}
