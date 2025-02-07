'use client';

import { BiCreditCard, BiLinkExternal } from 'react-icons/bi';
import Button from '~/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function SubscriptionBilling() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-1 font-medium">Current Plan</h3>
          <div className="flex items-center justify-between p-4 border border-gray-500 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Paid Plan</p>
              <p className="text-sm text-muted-foreground">$5.99/month</p>
              <p className="text-sm text-muted-foreground">
                Renews on{' '}
                <span className="font-medium">
                  {new Date(1681078400000).toLocaleDateString()}
                </span>
              </p>
            </div>
            <form>
              <Button
                type="submit"
                className="inline-flex items-center text-white bg-transparent hover:bg-blue-500/10"
              >
                Manage Subscription
                <BiLinkExternal className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
        <div>
          <h3 className="mb-1 font-medium">Payment Method</h3>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 border rounded-md">
                  <BiCreditCard className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium capitalize">Visa •••• 1234</p>
                  <p className="text-sm text-muted-foreground">
                    Expires on{' '}
                    <span className="font-medium">
                      {new Date(1681078400000).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              <form>
                <Button
                  type="submit"
                  className="inline-flex items-center text-white bg-transparent hover:bg-blue-500/10"
                >
                  Update
                  <BiLinkExternal className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
