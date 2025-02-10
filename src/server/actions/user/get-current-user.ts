import { createClient } from '~/utils/supabase/server';
import { getCurrentUserAuth } from './get-current-user-auth';
import { getCurrentUsersSubscription } from './get-current-users-subscription';

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const authenticatedUser = await getCurrentUserAuth();
  const authenticatedUserSubscription = await getCurrentUsersSubscription();

  if (!authenticatedUser) return;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authenticatedUser.id)
    .single();

  if (error) {
    console.log(error);
  }

  return {
    ...data,
    email: authenticatedUser.email,
    subscription: authenticatedUserSubscription,
  };
};
