'use client';

import { redirect } from 'next/navigation';
import { useIsMounted } from '~/hooks/use-is-mounted';
import { useUser } from '~/hooks/useUser';
import { AccountProfile } from './account-profile';
import { SubscriptionBilling } from './subscription-billing';

export function AccountSections() {
  const { user } = useUser();
  const isMounted = useIsMounted();

  if (!user) {
    redirect('/');
  }

  if (!isMounted) return null;

  return (
    <div className="p-6 space-y-9">
      <AccountProfile />
      <SubscriptionBilling />
    </div>
  );
}
