'use client';

import { useSearchParams } from 'next/navigation';
import { ForgotPassword } from './components/forgot-password';
import { ResetPassword } from './components/reset-password';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';

export function AuthenticationFeature() {
  const actionParam = useSearchParams().get('action');

  if (actionParam === 'forgot-password') {
    return <ForgotPassword />;
  }

  if (actionParam === 'reset-password') {
    return <ResetPassword />;
  }

  if (actionParam === 'sign-up') {
    return <SignUp />;
  }

  return <SignIn />;
}
