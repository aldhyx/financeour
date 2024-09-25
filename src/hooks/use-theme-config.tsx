import { useColorScheme } from 'nativewind';

import { DARK_THEME, LIGHT_THEME } from '@/constants/colors';

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DARK_THEME;

  return LIGHT_THEME;
}
