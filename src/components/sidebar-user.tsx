import { PropsWithChildren } from 'react';
import getSongsByUserId from '~/server/actions/getSongsByUserId';
import { getCurrentUser } from '~/server/actions/user/get-current-user';
import Sidebar from './Sidebar';

export async function SidebarUser({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  const userSongs = await getSongsByUserId();
  return (
    <Sidebar user={user as unknown as any} songs={userSongs}>
      {children}
    </Sidebar>
  );
}
