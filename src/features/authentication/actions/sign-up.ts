'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { encodedRedirect } from '~/utils/encoded-redirect';

import { createClient } from '~/utils/supabase/server';

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const referer = (await headers()).get('referer');

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!referer) return;

  if (!email || !password) {
    return encodedRedirect('error', referer, 'Email and password are required');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    encodedRedirect('error', referer, error.message);
  } else {
    encodedRedirect(
      'success',
      referer,
      'Thanks for signing up! Please check your email for a verification link.',
    );
  }

  revalidatePath('/', 'layout');
}
