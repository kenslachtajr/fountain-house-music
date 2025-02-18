'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

import { Box } from '~/components/ui/legacy/box';
import { usePlayerCurrentSongSelect } from '~/features/player/store/player.store';
import { cn } from '~/lib/cn';
import { Song, UserDetails } from '~/types/types';
import { useSetUser } from '../hooks/set-user';
import { Library } from './library';
import { SidebarItem } from './sidebar-item';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  user?: UserDetails | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, songs, user }) => {
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

  useSetUser(user);

  return (
    <div className={twMerge(`flex h-screen overflow-hidden`)}>
      <div className="hidden h-full w-[300px] flex-col gap-y-2 overflow-y-auto bg-black p-2 md:flex">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
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
          'flex-1 pt-2 overflow-auto',
          currentSong ? "pb-[160px] md:pb-[80px]" : "pb-[80px] md:pb-0"
        )}
      >
        {children}
      </main>
    </div>
  );
};
