import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DevToolsBubble } from 'react-native-react-query-devtools';

import { useThemeConfig } from '@/hooks/use-theme-config';

const queryClient = new QueryClient();

export const Providers = (props: PropsWithChildren) => {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <SheetProvider>{props.children}</SheetProvider>
          </ThemeProvider>
        </KeyboardProvider>

        <DevToolsBubble />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
