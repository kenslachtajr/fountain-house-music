import { Header } from '~/components/app-header';
import { ArtistImage } from './artist-image';

interface ArtistHeaderProps {
  name: string;
  songCount: number;
  albumCount: number;
  imagePath: string | null;
}

export function ArtistHeader({ name, songCount, albumCount, imagePath }: ArtistHeaderProps) {
  return (
    <Header>
      <div className="mt-20 flex flex-col items-center gap-x-5 text-center md:flex-row md:text-left">
        <ArtistImage imagePath={imagePath} />
        <div className="mt-4 flex flex-col gap-y-2 md:mt-0">
          <p className="hidden text-sm font-semibold md:block">Artist</p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {name}
          </h1>
          <div className="text-sm text-gray-300 flex flex-col md:flex-row md:gap-x-2">
            <span>
              {albumCount} {albumCount === 1 ? 'album' : 'albums'}
            </span>
            <span className="hidden md:inline">&middot;</span>
            <span>
              {songCount} {songCount === 1 ? 'song' : 'songs'}
            </span>
          </div>
        </div>
      </div>
    </Header>
  );
}
