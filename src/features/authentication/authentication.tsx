'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { useAuthenticationModal } from './hooks/use-authentication-dialog';

export function AuthenticationFeature() {
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();
  const { isOpen, closeDialog } = useAuthenticationModal();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    router.replace(`${pathname}/${createQueryString('action')}`);
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
