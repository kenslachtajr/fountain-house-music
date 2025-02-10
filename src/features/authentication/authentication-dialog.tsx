'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useCreateQueryString } from '~/utils/create-query-string';
import { AuthenticationFeature } from './authentication';
import {
  useAuthenticationDialogActions,
  useIsAuthenticationDialogOpenSelect,
} from './stores/use-authentication-dialog';

export function AuthenticationDialogFeature() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUserSelect();
  const createQueryString = useCreateQueryString();
  const isOpen = useIsAuthenticationDialogOpenSelect();
  const { closeDialog } = useAuthenticationDialogActions();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    router.replace(`${pathname}/${createQueryString('action')}`);
    closeDialog();
  };

  useEffect(() => {
    if (!user) return;
    closeDialog();
  }, [user, closeDialog]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border border-neutral-700 bg-neutral-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>Log in to your account</DialogDescription>
        </DialogHeader>

        <AuthenticationFeature />
      </DialogContent>
    </Dialog>
  );
}
