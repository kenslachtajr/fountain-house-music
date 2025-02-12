'use client';

import { useIsMounted } from '~/hooks/use-is-mounted';
import { AccountProfile } from './account-profile';
import { SubscriptionBilling } from './subscription-billing';

export function AccountSections() {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="space-y-9 p-6">
      <AccountProfile />
      <SubscriptionBilling />
    </div>
  );
}
