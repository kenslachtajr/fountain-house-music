import Image from 'next/image';

import Link from 'next/link';
import { BiDisc } from 'react-icons/bi';
import useLoadImage from '~/hooks/useLoadImage';
import { Album } from '~/types/types';
import { formatDate } from '~/utils/format-date';
import PlayButton from './PlayButton';

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
      <div className="relative flex flex-col items-center justify-center p-3 overflow-hidden transition rounded-md cursor-pointer group gap-x-4 bg-neutral-400/5 hover:bg-neutral-400/10">
        <div className="relative w-full h-full overflow-hidden rounded-md aspect-square">
          <Image
            className="object-cover"
            src={imageUrl || '/images/placeholder.jpeg'}
            fill
            alt="Image"
          />
        </div>
        <div className="flex flex-col items-start w-full pt-4 gap-y-1">
          <p className="w-full font-semibold truncate">{album.name}</p>
          <p className="w-full text-sm font-semibold text-gray-400 truncate">
            {album.author}
          </p>
          <span className="inline-flex justify-between w-full text-gray-500">
            <span className="text-xs font-semibold truncate">
              {album.duration} &middot; {releaseDate}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold truncate">
              <BiDisc /> {album.songs_count} songs
            </span>
          </span>
        </div>
        <div
          className="absolute hidden bottom-24 right-5 md:block"
          onClick={handlePlayAlbum}
        >
          <PlayButton />
        </div>
      </div>
    </Link>
  );
}
