import { withAuth } from '~/server/with-auth';
import { getCurrentUsersSubscription } from './get-current-users-subscription';

export const getCurrentUser = () => {
  return withAuth(async (supabase, user) => {
    if (!user) return;
    const authenticatedUserSubscription = await getCurrentUsersSubscription();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log(error);
    }

    return {
      ...data,
      email: user.email,
      subscription: authenticatedUserSubscription,
    };
  });
};
