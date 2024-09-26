import { Env } from '@env';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { translate } from '@/lib/i18n';

const SettingsScreen = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Pengaturan',
        }}
      />
      <Text tx="bottom_nav.budget" />
      <Text>{translate('bottom_nav.profile')}</Text>
      <Text className="text-center">
        {Env.NAME} - v{Env.VERSION}
      </Text>
    </View>
  );
};

export default SettingsScreen;
