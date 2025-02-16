'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { AuthenticationFeature } from './authentication';
import {
  useAuthenticationDialogActions,
  useAuthenticationDialogOpenedToSelect,
  useIsAuthenticationDialogOpenSelect,
} from './stores/use-authentication-dialog';

export function AuthenticationDialogFeature() {
  const { closeDialog } = useAuthenticationDialogActions();
  const isDialogOpen = useIsAuthenticationDialogOpenSelect();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border border-neutral-700 bg-neutral-800 sm:max-w-md">
        <AuthenticationHeader />
        <AuthenticationFeature />
      </DialogContent>
    </Dialog>
  );
}

function AuthenticationHeader() {
  const dialogOpenedTo = useAuthenticationDialogOpenedToSelect();

  if (dialogOpenedTo === 'sign-up') {
    return (
      <DialogHeader>
        <DialogTitle>Sign up</DialogTitle>
        <DialogDescription>Create your account</DialogDescription>
      </DialogHeader>
    );
  }

  if (dialogOpenedTo === 'forgot-password') {
    return (
      <DialogHeader>
        <DialogTitle>Forgot your password?</DialogTitle>
        <DialogDescription>Enter your email address</DialogDescription>
      </DialogHeader>
    );
  }

  if (dialogOpenedTo === 'reset-password') {
    return (
      <DialogHeader>
        <DialogTitle>Reset your password</DialogTitle>
        <DialogDescription>Enter your new password</DialogDescription>
      </DialogHeader>
    );
  }

  if (dialogOpenedTo === 'sign-in') {
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
