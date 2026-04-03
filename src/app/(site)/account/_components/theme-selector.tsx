'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { THEMES, ThemeId, getThemeById } from '~/utils/theme';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useCurrentUserSelect, useCurrentUserActions } from '~/features/layout/store/current-user';
import { createClient } from '~/utils/supabase/client';

export function ThemeSelector() {
  const user = useCurrentUserSelect();
  const { setUser } = useCurrentUserActions();
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(
    (user?.theme as ThemeId) ?? 'blue',
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeSelect = async (themeId: ThemeId) => {
    if (!user) return toast.error('You must be logged in to change theme');
    if (themeId === selectedTheme) return;

    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .update({ theme: themeId })
      .eq('id', user.id);

    if (error) {
      toast.error(error.message || 'Failed to save theme');
      setIsSaving(false);
    } else {
      setSelectedTheme(themeId);
      const theme = getThemeById(themeId);
      document.documentElement.style.setProperty('--primary', theme.hsl);
      setUser({ ...user, theme: themeId });
      toast.success('Theme updated!');
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accent Color</CardTitle>
        <CardDescription>Choose your preferred accent color</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                disabled={isSaving}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 disabled:cursor-not-allowed"
                title={theme.name}
              >
                <span
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: theme.color }}
                />
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white drop-shadow-md" />
                  </span>
                )}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
