'use client';

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

  return <SignIn />;
}
