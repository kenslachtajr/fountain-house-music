'use client';

import Image from 'next/image';
import useLoadImage from '~/hooks/useLoadImage';
import { Album } from '~/types/types';

interface AlbumImageProps {
  album: Album;
}

export function AlbumImage({ album }: AlbumImageProps) {
  const imageUrl = useLoadImage(album);

  return (
    <div className="relative w-32 h-32 lg:h-44 lg:w-44">
      <Image
        fill
        alt="Album"
        src={imageUrl ?? '/images/liked.jpeg'}
        className="object-cover"
      />
    </div>
  );
}
