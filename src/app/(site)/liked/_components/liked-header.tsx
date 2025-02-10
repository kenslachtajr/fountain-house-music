import Image from 'next/image';
import { Header } from '~/components/header';

export function LikedHeader() {
  return (
    <Header>
      <div className="mt-20">
        <div className="flex flex-col items-center md:flex-row gap-x-5">
          <div className="relative w-32 h-32 lg:h-44 lg:w-44">
            <Image
              fill
              alt="Playlist"
              src="/images/liked.jpeg"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col mt-4 gap-y-2 md:mt-0">
            <p className="hidden text-sm font-semibold md:block">Playlist</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
              Liked Songs
            </h1>
          </div>
        </div>
      </div>
    </Header>
  );
}
