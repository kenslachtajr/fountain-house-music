'use client';

import toast from 'react-hot-toast';
import { BiLinkExternal } from 'react-icons/bi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/legacy/button';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useSubscribeDialogActions } from '~/features/subscribe/stores/use-subscribe-dialog';
import { Subscription } from '~/types/types';
import { postData } from '~/utils/post-data';

export function SubscriptionBilling() {
  const user = useCurrentUserSelect();
  const { openDialog: openSubscribeDialog } = useSubscribeDialogActions();
  const subscription = user?.subscription;
  const prices = subscription?.prices;

  const redirectToCustomerPortal = async () => {
    try {
      if (!subscription?.prices?.active) {
        openSubscribeDialog();
        return;
      }

      const { url } = await postData({
        url: '/api/create-portal-link',
      });

      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error)?.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Billing</CardTitle>
        <CardDescription>Manage your subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <>
          <h3 className="mb-1 font-medium">Current Plan</h3>
          <div className="flex items-center justify-between rounded-lg border border-gray-500 p-4">
            <div className="space-y-1">
              <p className="font-medium">{prices?.products?.name}</p>
              <p className="text-sm text-muted-foreground">$5.99 / month</p>
              <SubscriptionDates subscription={subscription!} />
            </div>
            <form>
              <Button
                className="inline-flex items-center bg-transparent text-white hover:bg-blue-500/10"
                onClick={redirectToCustomerPortal}
              >
                Manage Subscription
                <BiLinkExternal className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      </CardContent>
    </Card>
  );
}

interface SubscriptionDatesProps {
  subscription: Subscription;
}

function SubscriptionDates({ subscription }: SubscriptionDatesProps) {
  if (subscription?.ended_at) {
    return (
      <p className="text-sm text-muted-foreground">
        Ended on{' '}
        <span className="font-medium">
          {new Date(subscription.ended_at).toLocaleDateString()}
        </span>
      </p>
    );
  }

  if (!subscription?.ended_at && !subscription?.created) {
    return <p className="text-sm text-muted-foreground">Start listening now</p>;
  }

  if (subscription?.cancel_at_period_end) {
    return (
      <p className="text-sm text-muted-foreground">
        Cancels on{' '}
        <span className="font-medium">
          {new Date(subscription?.current_period_start).toLocaleDateString()}
        </span>
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Renews on{' '}
      <span className="font-medium">
        {new Date(subscription?.current_period_end!).toLocaleDateString()}
      </span>
    </p>
  );
}
