'use client';

import Image from 'next/image';

import useLoadImage from '~/hooks/useLoadImage';
import { Song } from '~/types';
import PlayButton from './PlayButton';

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);
  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative flex flex-col items-center justify-center p-3 overflow-hidden transition rounded-md cursor-pointer group gap-x-4 bg-neutral-400/5 hover:bg-neutral-400/10"
    >
      <div className="relative w-full h-full overflow-hidden rounded-md aspect-square">
        <Image
          className="object-cover"
          src={imagePath || '/images/placeholder.jpeg'}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="w-full font-semibold truncate">{data.title}</p>
        <p className="w-full pb-4 text-sm truncate text-neutral-400">
          {data.author}
        </p>
      </div>
      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
