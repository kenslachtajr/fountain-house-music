'use client';

import { useIsMounted } from '~/hooks/use-is-mounted';
import { AccountProfile } from './profile/account-profile';
import { SubscriptionBilling } from './subscription-billing';

export function AccountSections() {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="p-6 space-y-9">
      <AccountProfile />
      <SubscriptionBilling />
    </div>
  );
}
