import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack } from 'expo-router';
import React from 'react';

import { HeaderBar } from '@/components/ui/header-bar';

const TransactionLayout = () => {
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
      initialRouteName="list"
    >
      <Stack.Screen
        name="create"
        options={{
          title: _(msg`Add transaction`),
          header({ options }) {
            return <HeaderBar title={options.title} leftIcon="cancel" />;
          },
        }}
      />

      <Stack.Screen
        name="list"
        options={{
          title: _(msg`Transaction history`),
        }}
      />
    </Stack>
  );
};

export default TransactionLayout;
