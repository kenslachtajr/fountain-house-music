import { getLikedSongs } from '~/server/actions/songs/get-liked-songs';
import { LikedContent } from './_components/liked-content';
import { LikedHeader } from './_components/liked-header';

export const revalidate = 0;

export default async function Liked() {
  const songs = await getLikedSongs();

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <LikedHeader />
      <LikedContent songs={songs} />
    </div>
  );
}
