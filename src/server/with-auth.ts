import { SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import { createClient } from '../utils/supabase/server';
import { getCurrentUserAuth } from './queries/user/get-current-user-auth';

export async function withAuth<T>(
  handler: (
    supabase: SupabaseClient<Database>,
    user: User | null,
  ) => Promise<T>,
): Promise<T> {
  const supabase = await createClient();
  const user = await getCurrentUserAuth();

  if (!user) {
    console.log('Unauthorized');
  }

  return handler(supabase, user);
}
