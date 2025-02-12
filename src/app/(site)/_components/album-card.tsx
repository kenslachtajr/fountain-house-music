import Image from 'next/image';

import Link from 'next/link';
import { BiDisc } from 'react-icons/bi';
import { useLoadImage } from '~/hooks/use-load-image';
import { Album } from '~/types/types';
import { formatDate } from '~/utils/format-date';
import { PlayButton } from './play-button';

interface AlbumCardProps {
  album: Album;
  onPlayAlbum: (album: Album) => void;
}

export function AlbumCard({ album, onPlayAlbum }: AlbumCardProps) {
  const imageUrl = useLoadImage(album);
  const releaseDate = formatDate(album.release_date!, { year: 'numeric' });

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.preventDefault();
    onPlayAlbum(album);
  };

  return (
    <Link href={`/album/${album.id}`}>
      <div className="group relative flex cursor-pointer flex-col items-center justify-center gap-x-4 overflow-hidden rounded-md bg-neutral-400/5 p-3 transition hover:bg-neutral-400/10">
        <div className="relative aspect-square h-full w-full overflow-hidden rounded-md">
          <Image
            className="object-cover"
            src={imageUrl || '/images/placeholder.jpeg'}
            fill
            alt="Image"
          />
        </div>
        <div className="flex w-full flex-col items-start gap-y-1 pt-4">
          <p className="w-full truncate font-semibold">{album.name}</p>
          <p className="w-full truncate text-sm font-semibold text-gray-400">
            {album.author}
          </p>
          <span className="inline-flex w-full justify-between text-gray-500">
            <span className="truncate text-xs font-semibold">
              {album.duration} &middot; {releaseDate}
            </span>
            <span className="inline-flex items-center gap-1 truncate text-xs font-semibold">
              <BiDisc /> {album.songs_count} songs
            </span>
          </span>
        </div>
        <div
          className="absolute bottom-24 right-5 hidden md:block"
          onClick={handlePlayAlbum}
        >
          <PlayButton />
        </div>
      </div>
    </Link>
  );
}
