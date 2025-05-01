'use client';

import { shouldNeverHappen } from '~/utils/should-never-happen';
import { ForgotPassword } from './components/forgot-password';
import { ResetPassword } from './components/reset-password';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';
import { useAuthenticationDialogOpenedToSelect } from './stores/use-authentication-dialog';

export function AuthenticationFeature() {
  const dialogOpenedTo = useAuthenticationDialogOpenedToSelect();

  if (dialogOpenedTo === 'forgot-password') {
    return <ForgotPassword />;
  }

  if (dialogOpenedTo === 'reset-password') {
    return <ResetPassword />;
  }

  if (dialogOpenedTo === 'sign-up') {
    return <SignUp />;
  }

  if (dialogOpenedTo === 'sign-in') {
    return <SignIn />;
  }

  return shouldNeverHappen(
    `Unknown authentication dialog state: ${dialogOpenedTo}`,
  );
}
