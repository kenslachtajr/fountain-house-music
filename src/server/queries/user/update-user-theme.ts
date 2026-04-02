import { withAuth } from '~/server/with-auth';
import { ThemeId } from '~/utils/theme';

export const updateUserTheme = (theme: ThemeId) => {
  return withAuth(async (supabase, user) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
      .from('users')
      .update({ theme })
      .eq('id', user.id);

    if (error) {
      console.log(error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  });
};
