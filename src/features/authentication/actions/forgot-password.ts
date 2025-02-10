'use server';

import { headers } from 'next/headers';
import { encodedRedirect } from '~/utils/encoded-redirect';
import { createClient } from '~/utils/supabase/server';

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const referer = (await headers()).get('referer');

  if (!referer) return;

  if (!email) {
    return encodedRedirect('error', referer, 'Email is required');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/?action=reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect('error', referer, 'Could not reset password');
  }

  return encodedRedirect(
    'success',
    referer,
    'Check your email for a link to reset your password.',
  );
}
