import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
} from 'expo-status-bar';
import React, { PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { useThemeConfig } from '@/hooks/use-theme-config';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';

import { DevTools } from './dev-tools';
import { QueryClientProvider } from './query-provider';

export const Providers = (props: PropsWithChildren) => {
  const theme = useThemeConfig();

  useEffect(() => {
    setStatusBarBackgroundColor(theme.colors.background, true);
    setStatusBarStyle(theme.dark ? 'light' : 'dark', true);
    setAndroidNavigationBar(theme.dark ? 'dark' : 'light');
  }, [theme.dark]);

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      className={theme.dark ? `dark` : undefined}
    >
      <DevTools />
      <SafeAreaProvider
        // A weird behavior:
        // when navigating from screen -> tabs
        // the app will show a flicker
        // cause by this safeAreaProvider that has a white bg on dark theme, so we have to override using app colors
        style={{ backgroundColor: theme.colors.background }}
        initialMetrics={initialWindowMetrics}
      >
        <QueryClientProvider>
          <KeyboardProvider>
            <ThemeProvider value={theme}>
              <BottomSheetModalProvider>
                {props.children}
              </BottomSheetModalProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
