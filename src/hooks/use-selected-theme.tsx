import { colorScheme, useColorScheme } from 'nativewind';
import React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { MoonIcon, Smartphone, SunIcon } from '@/components/ui/icon';
import { STORED_KEY } from '@/constants/local-storage-key';
import { storage } from '@/lib/storage';

export type ColorSchemeType = 'light' | 'dark' | 'system';

export const APP_THEMES = [
  { label: 'System default (auto)', id: 'system', icon: Smartphone },
  { label: 'Light', id: 'light', icon: SunIcon },
  { label: 'Dark', id: 'dark', icon: MoonIcon },
] as const;

/**
 * This hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useColorScheme from nativewind instead
 *
 */
export const useSelectedTheme = () => {
  const { setColorScheme } = useColorScheme();
  const [_theme, _setTheme] = useMMKVString(STORED_KEY.COLOR_SCHEMA, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme]
  );

  const theme = (_theme ?? 'system') as ColorSchemeType;
  const selectedTheme =
    APP_THEMES.find(({ id }) => id === theme) ?? APP_THEMES[0];
  return { selectedTheme, setSelectedTheme } as const;
};

// To be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storage.getString(STORED_KEY.COLOR_SCHEMA);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType);
  }
};
