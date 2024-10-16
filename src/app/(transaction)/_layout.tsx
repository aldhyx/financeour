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
          title: 'Tambah transaksi',
          header({ options }) {
            return <HeaderBar title={options.title} leftIcon="cancel" />;
          },
        }}
      />

      <Stack.Screen
        name="list"
        options={{
          title: 'Semua transaksi',
        }}
      />
    </Stack>
  );
};

export default TransactionLayout;
