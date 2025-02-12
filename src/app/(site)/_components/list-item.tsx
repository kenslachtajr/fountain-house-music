'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

export const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const user = useCurrentUserSelect();

  if (!user) return;

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <Link
        href={href}
        className="group relative flex items-center gap-x-4 overflow-hidden rounded-md bg-neutral-100/10 pr-4 transition hover:bg-neutral-100/20"
      >
        <div className="relative min-h-[64px] min-w-[64px]">
          <Image className="object-cover" fill src={image} alt="Image" />
        </div>
        <p className="truncate py-5 font-medium">{name}</p>
        <div className="absolute right-5 flex items-center justify-center rounded-full bg-blue-500 p-4 opacity-0 drop-shadow-md transition hover:scale-110 group-hover:opacity-100">
          <FaPlay className="text-black" />
        </div>
      </Link>
    </div>
  );
};
