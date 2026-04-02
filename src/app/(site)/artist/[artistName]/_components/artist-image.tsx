'use client';

import Image from 'next/image';
import { useLoadImage } from '~/hooks/use-load-image';

export function ArtistImage({ imagePath }: { imagePath: string | null }) {
  const imageUrl = useLoadImage({ image_path: imagePath } as any);

  return (
    <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full lg:h-52 lg:w-52">
      <Image
        className="object-cover"
        src={imageUrl || '/images/placeholder.jpeg'}
        fill
        alt="Artist"
        sizes="208px"
      />
    </div>
  );
}
