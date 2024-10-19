import { Stack } from 'expo-router';

import { HeaderBar } from '@/components/ui/header-bar';

const AccountLayout = () => (
  <Stack
    screenOptions={{
      headerShadowVisible: false,
      animation: 'fade_from_bottom',
      header({ options }) {
        return <HeaderBar title={options.title} />;
      },
    }}
  >
    <Stack.Screen
      name="index"
      options={{
        title: 'My accounts',
      }}
    />

    <Stack.Screen
      name="create"
      options={{
        title: 'Add account',
        header({ options }) {
          return <HeaderBar title={options.title} leftIcon="cancel" />;
        },
      }}
    />
  </Stack>
);

export default AccountLayout;
