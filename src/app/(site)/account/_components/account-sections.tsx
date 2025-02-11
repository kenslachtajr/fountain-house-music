'use client';

import { useIsMounted } from '~/hooks/use-is-mounted';
import { AccountProfile } from './account-profile';
import { SubscriptionBilling } from './subscription-billing';
import Button from '~/components/Button';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function AccountSections() {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // TODO: reset any playing songs
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
    }
  };

  return (
    <div className="p-6 space-y-9">
      <AccountProfile />
      <SubscriptionBilling />
      <Link href="/"
            onClick={handleLogout} className="inline-block px-6 py-2 bg-white text-black rounded-full">
        Logout
      </Link>
    </div>
  );
}
