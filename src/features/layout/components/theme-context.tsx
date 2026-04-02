'use client';

import { createContext, useContext } from 'react';

export interface ThemeContextValue {
  primaryColor: string;
}

export const ThemeContext = createContext<ThemeContextValue>({
  primaryColor: '#3b82f6',
});

export function useTheme() {
  return useContext(ThemeContext);
}
