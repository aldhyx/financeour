import '../../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Providers } from '@/components/providers';
import { useLoadDB } from '@/hooks/use-load-db';
import { loadSelectedTheme } from '@/hooks/use-selected-theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(main)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// load saved theme from local storage
loadSelectedTheme();

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
