'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { usePlayerCurrentSongSelect } from '~/features/player/store/player.store';
import { cn } from '~/lib/cn';
import { Song } from '~/types/types';
import Box from './Box';
import Library from './Library';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const currentSong = usePlayerCurrentSongSelect();
  const pathname = usePathname();
  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname !== '/search',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
      },
    ],
    [pathname],
  );
  return (
    <div
      className={twMerge(
        `*:
        flex
        h-screen
        overflow-hidden
      `,
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2 overflow-y-auto">
        <Box>
          <div className="flex flex-col px-5 py-4 gap-y-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="h-full overflow-y-auto">
          <Library songs={songs} />
        </Box>
      </div>
      <main
        className={cn(
          'flex-1 h-full py-2 overflow-y-auto',
          currentSong ? 'h-[calc(100%-64px)]' : 'h-full',
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
