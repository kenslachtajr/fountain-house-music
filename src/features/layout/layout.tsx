import { PropsWithChildren } from 'react';

import { MobileNavigationFeature } from '~/features/layout/components/mobile-navigation';
import { getSongsByUserId } from '~/server/queries/songs/get-songs-by-user-id';
import { getCurrentUser } from '~/server/queries/user/get-current-user';
import { UserDetails } from '~/types/types';
import { PlayerFeature } from '../player/player';
import { GlobalToaster } from './components/global-toaster';
import { IncludeModals } from './components/include-modals';
import { Providers } from './components/providers';
import { Sidebar } from './components/sidebar';

export async function LayoutFeature({ children }: PropsWithChildren<unknown>) {
  const user = await getCurrentUser();
  const userSongs = await getSongsByUserId();

  return (
    <Providers>
      <Sidebar songs={userSongs ?? []} user={user as UserDetails}>
        {children}
      </Sidebar>

      <div className="fixed bottom-0 w-full">
        <PlayerFeature />
        <MobileNavigationFeature />
      </div>
      <GlobalToaster />
      <IncludeModals />
    </Providers>
  );
}
