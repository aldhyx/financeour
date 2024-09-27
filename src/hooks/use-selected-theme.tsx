import { colorScheme, useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { STORED_KEY } from '@/constants/local-storage-key';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { storage } from '@/lib/storage';

export type ColorSchemeType = 'light' | 'dark' | 'system';

/**
 * This hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useColorScheme from nativewind instead
 *
 */
export const useSelectedTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [_theme, _setTheme] = useMMKVString(STORED_KEY.COLOR_SCHEMA, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme]
  );

  useEffect(() => {
    setAndroidNavigationBar(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  const selectedTheme = (_theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

// To be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storage.getString(STORED_KEY.COLOR_SCHEMA);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType);
    setAndroidNavigationBar(colorScheme.get() === 'dark' ? 'dark' : 'light');
  }
};
