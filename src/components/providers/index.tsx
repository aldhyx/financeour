import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
} from 'expo-status-bar';
import React, { PropsWithChildren, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DevToolsBubble } from 'react-native-react-query-devtools';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { useThemeConfig } from '@/hooks/use-theme-config';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';

const queryClient = new QueryClient();

export const Providers = (props: PropsWithChildren) => {
  const theme = useThemeConfig();

  useEffect(() => {
    setStatusBarBackgroundColor(theme.colors.background, true);
    setStatusBarStyle(theme.dark ? 'light' : 'dark', true);
    setAndroidNavigationBar(theme.dark ? 'dark' : 'light');
  }, [theme.colors.background, theme.dark]);

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <SafeAreaProvider
        // A weird behavior:
        // when navigating from screen -> tabs
        // the app will show a flicker
        // cause by this safeAreaProvider that has a white bg on dark theme, so we have to override using app colors
        style={{ backgroundColor: theme.colors.background }}
        initialMetrics={initialWindowMetrics}
      >
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <ThemeProvider value={theme}>
              <SheetProvider>{props.children}</SheetProvider>
            </ThemeProvider>
          </KeyboardProvider>

          <DevToolsBubble />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
