import '../../global.css';
import '../i18n/dayjs';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  setStatusBarBackgroundColor,
  setStatusBarStyle,
} from 'expo-status-bar';
import { PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { DevTools } from '@/components/dev-tools';
import BottomSheetRootProvider from '@/components/providers/bottom-sheet-root-provider';
import I18nProvider from '@/components/providers/i18n-provider';
import { QueryClientProvider } from '@/components/providers/query-provider';
import { useLoadDB } from '@/hooks/use-load-db';
import { loadSelectedTheme } from '@/hooks/use-selected-theme';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { loadSelectedLocale } from '@/i18n/i18n';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(main)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// initialize app theme
loadSelectedTheme();
// initialize locale
loadSelectedLocale();

// Register all provider here
const Providers = (props: PropsWithChildren) => {
  const theme = useThemeConfig();

  useEffect(() => {
    setStatusBarBackgroundColor(theme.colors.background, true);
    setStatusBarStyle(theme.dark ? 'light' : 'dark', true);
    setAndroidNavigationBar(theme.dark ? 'dark' : 'light');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <I18nProvider>
          <QueryClientProvider>
            <KeyboardProvider>
              <ThemeProvider value={theme}>
                <BottomSheetModalProvider>
                  <BottomSheetRootProvider>
                    {props.children}
                  </BottomSheetRootProvider>
                </BottomSheetModalProvider>
              </ThemeProvider>
            </KeyboardProvider>
          </QueryClientProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
    'Open-Sans': require('@assets/fonts/OpenSans.ttf'),
  });
  const { loaded: dbLoaded } = useLoadDB();

  useEffect(() => {
    if (fontLoaded && dbLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, dbLoaded]);

  if (!dbLoaded && !fontLoaded && !error) return null;

  return (
    <Providers>
      <Stack
        screenOptions={{
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(account)" options={{ headerShown: false }} />
        <Stack.Screen name="(transaction)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
