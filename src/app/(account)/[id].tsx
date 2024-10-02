import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export const AccountDetailScreen = () => {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Detail akun' }} />
      <Text className="">AccountDetailScreen </Text>
    </View>
  );
};
