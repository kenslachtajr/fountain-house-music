'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useCreateQueryString } from '~/hooks/use-create-query-string';
import { AuthenticationFeature } from './authentication';
import { useUserActionSearchParam } from './hooks/user-action-search-param';
import {
  useAuthenticationDialogActions,
  useIsAuthenticationDialogOpenSelect,
} from './stores/use-authentication-dialog';
import { AuthAction } from './utils/constants';

export function AuthenticationDialogFeature() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUserSelect();
  const action = useUserActionSearchParam();
  const createQueryString = useCreateQueryString();
  const isOpen = useIsAuthenticationDialogOpenSelect();
  const { closeDialog, openDialog } = useAuthenticationDialogActions();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    router.replace(`${pathname}/${createQueryString('action')}`);
    closeDialog();
  };

  useEffect(() => {
    if (!user) return;
    closeDialog();
  }, [user, closeDialog]);

  useEffect(() => {
    if (action) {
      openDialog();
    } else {
      closeDialog();
    }
  }, [action, user, closeDialog]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border border-neutral-700 bg-neutral-800 sm:max-w-md">
        <AuthenticationHeader />
        <AuthenticationFeature />
      </DialogContent>
    </Dialog>
  );
}

function AuthenticationHeader() {
  const action = useSearchParams().get('action') as AuthAction;

  if (action === 'sign-up') {
    return (
      <DialogHeader>
        <DialogTitle>Sign up</DialogTitle>
        <DialogDescription>Create your account</DialogDescription>
      </DialogHeader>
    );
  }

  if (action === 'forgot-password') {
    return (
      <DialogHeader>
        <DialogTitle>Forgot your password?</DialogTitle>
        <DialogDescription>Enter your email address</DialogDescription>
      </DialogHeader>
    );
  }

  if (action === 'reset-password') {
    return (
      <DialogHeader>
        <DialogTitle>Reset your password</DialogTitle>
        <DialogDescription>Enter your new password</DialogDescription>
      </DialogHeader>
    );
  }

  if (action === 'sign-in') {
    return (
      <DialogHeader>
        <DialogTitle>Welcome back!</DialogTitle>
        <DialogDescription>Log in to your account</DialogDescription>
      </DialogHeader>
    );
  }

  return (
    <DialogHeader>
      <DialogTitle></DialogTitle>
    </DialogHeader>
  );
}
