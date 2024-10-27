import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack } from 'expo-router';

import { HeaderBar } from '@/components/ui/header-bar';

const AccountLayout = () => {
  const { _ } = useLingui();

  return (
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
          title: _(msg`My accounts`),
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: _(msg`Add account`),
          header({ options }) {
            return <HeaderBar title={options.title} leftIcon="cancel" />;
          },
        }}
      />
    </Stack>
  );
};

export default AccountLayout;
