export const THEMES = [
  { id: 'blue', name: 'Blue', hsl: '240 70% 50%', color: '#3b82f6' },
  { id: 'red', name: 'Red', hsl: '0 70% 50%', color: '#ef4444' },
  { id: 'green', name: 'Green', hsl: '120 70% 40%', color: '#22c55e' },
  { id: 'purple', name: 'Purple', hsl: '270 70% 55%', color: '#a855f7' },
  { id: 'orange', name: 'Orange', hsl: '25 90% 55%', color: '#f97316' },
  { id: 'pink', name: 'Pink', hsl: '330 75% 55%', color: '#ec4899' },
  { id: 'teal', name: 'Teal', hsl: '175 70% 40%', color: '#14b8a6' },
  { id: 'yellow', name: 'Yellow', hsl: '50 90% 55%', color: '#eab308' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export function getThemeById(id: string | null | undefined): (typeof THEMES)[number] {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
