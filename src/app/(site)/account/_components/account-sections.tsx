'use client';

import { redirect } from 'next/navigation';
import { useAsync } from '~/hooks/use-async';
import { useIsMounted } from '~/hooks/use-is-mounted';
import { getCurrentUser } from '~/server/actions/user/get-current-user';
import { AccountProfile } from './account-profile';
import { SubscriptionBilling } from './subscription-billing';

export function AccountSections() {
  const { data: user } = useAsync(getCurrentUser);
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
