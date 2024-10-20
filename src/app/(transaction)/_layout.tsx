import { Stack } from 'expo-router';
import React from 'react';

import { HeaderBar } from '@/components/ui/header-bar';

const TransactionLayout = () => {
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
          title: 'Add transaction',
          header({ options }) {
            return <HeaderBar title={options.title} leftIcon="cancel" />;
          },
        }}
      />

      <Stack.Screen
        name="list"
        options={{
          title: 'Transaction history',
        }}
      />
    </Stack>
  );
};

export default TransactionLayout;
