import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const ProfileScreen = () => {
  return (
    <View className="flex-1">
      <Link href="/(account)/" asChild>
        <Button variant="secondary" rounded="none">
          <Text>My account</Text>
        </Button>
      </Link>
    </View>
  );
};

export default ProfileScreen;
