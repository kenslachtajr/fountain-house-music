'use server';

import { headers } from 'next/headers';
import { encodedRedirect } from '~/utils/encoded-redirect';
import { createClient } from '~/utils/supabase/server';

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const referer = (await headers()).get('referer');

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!referer) return;

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      referer,
      'Password and confirm password are required',
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect('error', referer, 'Passwords do not match');
  }

  const { error } = await supabase.auth.updateUser(
    {
      password,
    },
    {
      emailRedirectTo: `${origin}/`,
    },
  );

  if (error) {
    encodedRedirect('error', referer, 'Password update failed');
  }

  encodedRedirect('success', '/', 'Password updated');
};
