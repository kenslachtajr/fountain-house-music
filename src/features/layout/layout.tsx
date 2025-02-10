import { PropsWithChildren } from 'react';
import getSongsByUserId from '~/server/actions/getSongsByUserId';
import { getCurrentUser } from '~/server/actions/user/get-current-user';
import { UserDetails } from '~/types/types';
import { PlayerFeature } from '../player/player';
import { GlobalToaster } from './components/global-toaster';
import { IncludeModals } from './components/include-modals';
import { Sidebar } from './components/sidebar';

export async function LayoutFeature({ children }: PropsWithChildren<unknown>) {
  const user = await getCurrentUser();
  const userSongs = await getSongsByUserId();

  return (
    <>
      <Sidebar songs={userSongs} user={user as UserDetails}>
        {children}
      </Sidebar>

      <GlobalToaster />
      <PlayerFeature />
      <IncludeModals />
    </>
  );
}
