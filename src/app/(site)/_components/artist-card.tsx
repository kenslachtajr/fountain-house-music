import Image from 'next/image';
import Link from 'next/link';
import { BsMicFill } from 'react-icons/bs';
import { useLoadImage } from '~/hooks/use-load-image';
import { ArtistSummary } from '~/server/queries/artists/get-artists';

interface ArtistCardProps {
  artist: ArtistSummary;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const imageUrl = useLoadImage({ image_path: artist.image_path } as any);

  return (
    <Link href={`/artist/${encodeURIComponent(artist.name)}`}>
      <div className="group relative flex cursor-pointer flex-col items-center justify-center gap-x-4 overflow-hidden rounded-md bg-neutral-400/5 p-3 transition hover:bg-neutral-400/10">
        <div className="relative aspect-square h-full w-full overflow-hidden rounded-full">
          <Image
            className="object-cover"
            src={imageUrl || '/images/placeholder.jpeg'}
            fill
            alt={artist.name}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>
        <div className="flex w-full flex-col items-start gap-y-1 pt-4">
          <p className="w-full truncate font-semibold">{artist.name}</p>
          <span className="inline-flex w-full items-center gap-1 text-sm text-gray-400">
            <BsMicFill className="shrink-0" />
            <span className="truncate font-semibold">
              {artist.song_count} {artist.song_count === 1 ? 'song' : 'songs'}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
