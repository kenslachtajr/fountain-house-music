'use client';

import { useSearchParams } from 'next/navigation';
import { ForgotPassword } from './components/forgot-password';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';

export function AuthenticationFeature() {
  const actionParam = useSearchParams().get('action');

  if (actionParam === 'forgot-password') {
    return <ForgotPassword />;
  }

  if (actionParam === 'sign-up') {
    return <SignUp />;
  }

  return <SignIn />;
}
