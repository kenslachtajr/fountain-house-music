'use client';

import { useIsMounted } from '~/hooks/use-is-mounted';
import { AccountProfile } from './account-profile';
import { SubscriptionBilling } from './subscription-billing';
import toast from 'react-hot-toast';
import { createClient } from '~/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { usePlayerStoreActions } from '~/features/player/store/player.store';
import Link from 'next/link';

export function AccountSections() {
  const isMounted = useIsMounted();
  const router = useRouter();
  const player = usePlayerStoreActions();
  const supabaseClient = createClient();

  if (!isMounted) return null;

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();
    player.reset();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
    }
  };

  return (
    <div className="space-y-9 p-6">
      <AccountProfile />
      <SubscriptionBilling />
      <Link href="/"
            onClick={handleLogout} className="inline-block px-6 py-2 bg-white text-black rounded-full">
        Logout
      </Link>
    </div>
  );
}
