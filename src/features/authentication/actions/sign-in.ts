'use server';

import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '~/utils/encoded-redirect';

import { createClient } from '~/utils/supabase/server';

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    encodedRedirect('error', '/?action=sign-in', error.message);
  }

  revalidatePath('/', 'layout');
}
