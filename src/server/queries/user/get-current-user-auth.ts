import { createClient } from '~/utils/supabase/server';

export const getCurrentUserAuth = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
  }

  return data.user;
};
