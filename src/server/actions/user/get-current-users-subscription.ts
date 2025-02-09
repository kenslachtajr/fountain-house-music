import { createClient } from '~/utils/supabase/client';
import { getCurrentUserAuth } from './get-current-user-auth';

export const getCurrentUsersSubscription = async () => {
  const supabase = createClient();
  const authenticatedUser = await getCurrentUserAuth();

  if (!authenticatedUser) return;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .eq('user_id', authenticatedUser.id)
    .single();

  if (error) {
    console.log(error);
  }

  return data;
};
