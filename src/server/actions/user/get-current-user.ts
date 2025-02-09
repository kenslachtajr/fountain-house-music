import { createClient } from '~/utils/supabase/client';
import { getCurrentUserAuth } from './get-current-user-auth';

export const getCurrentUser = async () => {
  const supabase = createClient();
  const authenticatedUser = await getCurrentUserAuth();

  if (!authenticatedUser) return;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authenticatedUser.id)
    .single();

  if (error) {
    console.log(error);
  }

  return data;
};
