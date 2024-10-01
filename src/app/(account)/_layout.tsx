import { Stack } from 'expo-router';

import { HeaderBar } from '@/components/ui/header-bar';

const AccountLayout = () => (
  <Stack
    screenOptions={{
      headerShadowVisible: false,
      header({ options }) {
        return <HeaderBar title={options.title} />;
      },
    }}
  >
    <Stack.Screen
      name="index"
      options={{
        title: 'Akun saya',
      }}
    />
    <Stack.Screen
      name="create"
      options={{
        title: 'Tambah akun baru',
      }}
    />

    <Stack.Screen
      name="update"
      options={{
        title: 'Ubah akun',
      }}
    />
  </Stack>
);

export default AccountLayout;
