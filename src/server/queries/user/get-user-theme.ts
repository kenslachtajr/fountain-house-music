import { withAuth } from '~/server/with-auth';
import { ThemeId } from '~/utils/theme';

export const getUserTheme = () => {
  return withAuth(async (supabase, user) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('theme')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }

    return (data?.theme ?? 'blue') as ThemeId;
  });
};
