'use client';

import { useEffect, useState } from 'react';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { getThemeById, ThemeId } from '~/utils/theme';
import { ThemeContext } from './theme-context';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const user = useCurrentUserSelect();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');

  useEffect(() => {
    const themeId = (user?.theme as ThemeId) ?? 'blue';
    const theme = getThemeById(themeId);
    
    document.documentElement.classList.add('dark');
    setPrimaryColor(theme.color);
  }, [user?.theme]);

  return (
    <ThemeContext.Provider value={{ primaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
