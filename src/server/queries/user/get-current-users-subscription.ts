import { withAuth } from '~/server/with-auth';

export const getCurrentUsersSubscription = () => {
  return withAuth(async (supabase, user) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.log(error);
    }

    return data;
  });
};
