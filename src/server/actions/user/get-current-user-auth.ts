import { createClient } from '~/utils/supabase/client';

export const getCurrentUserAuth = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
  }

  // console.log('Watermelon', data);

  return data.user;
};
