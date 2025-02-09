'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '~/utils/supabase/server';

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: d, error } = await supabase.auth.signInWithPassword(data);

  console.log(d, error);
  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
}
