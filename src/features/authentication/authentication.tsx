'use client';

import { useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useCreateQueryString } from '~/utils/create-query-string';
import { ForgotPassword } from './components/forgot-password';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';

export function AuthenticationFeature() {
  const createQueryString = useCreateQueryString();
  const params = useSearchParams();
  const actionParam = params.get('action');

  const onOpenChange = (open: boolean) => {
    if (!open) {
      params;
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent className="border border-neutral-700 bg-neutral-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>Log in to your account</DialogDescription>
        </DialogHeader>

        <FormToDisplay />
      </DialogContent>
    </Dialog>
  );
}

function FormToDisplay() {
  const actionParam = useSearchParams().get('action');

  if (actionParam === 'forgot-password') {
    return <ForgotPassword />;
  }

  if (actionParam === 'sign-up') {
    return <SignUp />;
  }

  return <SignIn />;
}
