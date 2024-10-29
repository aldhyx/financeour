import { colorScheme, useColorScheme } from 'nativewind';
import React, { useMemo } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { MoonIcon, Smartphone, SunIcon } from '@/components/ui/icon';
import { STORED_KEY } from '@/constants/local-storage-key';
import { storage } from '@/lib/storage';

export type ColorSchemeType = 'light' | 'dark' | 'system';

const APP_THEMES = [
  { label: 'System (auto)', id: 'system', icon: Smartphone },
  { label: 'Light', id: 'light', icon: SunIcon },
  { label: 'Dark', id: 'dark', icon: MoonIcon },
] as const;

/**
 * We use system as default app theme
 */
const DEFAULT_APP_THEME = APP_THEMES[0];

/**
 * Used to set default app theme
 */
export const useSelectedTheme = () => {
  const { setColorScheme } = useColorScheme();
  const [_colorSchema, storeColorSchema] = useMMKVString(
    STORED_KEY.COLOR_SCHEMA,
    storage
  );

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      storeColorSchema(t);
    },
    [setColorScheme, storeColorSchema]
  );

  const selectedTheme = useMemo(() => {
    const storedColorSchema = (_colorSchema ?? 'system') as ColorSchemeType;
    const selected = APP_THEMES.find(({ id }) => id === storedColorSchema);
    return selected ?? DEFAULT_APP_THEME;
  }, [_colorSchema]);

  return { selectedTheme, setSelectedTheme, appThemes: APP_THEMES };
};

/**
 * Used in the root to initialize theme from persisted store, fallback to system theme
 */
export const loadSelectedTheme = () => {
  const theme = storage.getString(STORED_KEY.COLOR_SCHEMA);
  if (theme && typeof theme === 'string') {
    const selectedTheme = APP_THEMES.find(({ id }) => id === theme);
    colorScheme.set(selectedTheme ? selectedTheme.id : 'system');
  }
};
