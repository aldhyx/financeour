import 'react-native-reanimated';
import '../../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { loadSelectedTheme } from '@/hooks/use-selected-theme';
import { useThemeConfig } from '@/hooks/use-theme-config';

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
  const [loaded, error] = useFonts({
    'Open-Sans': require('@assets/fonts/OpenSans.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}
