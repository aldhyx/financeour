import { Stack } from 'expo-router';

const AccountLayout = () => (
  <Stack
    screenOptions={{
      headerShadowVisible: false,
      animation: 'fade_from_bottom',
    }}
  >
    <Stack.Screen name="index" options={{ title: 'Akun saya' }} />
    <Stack.Screen name="create" options={{ title: 'Tambah akun' }} />
  </Stack>
);

export default AccountLayout;
