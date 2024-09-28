import { View } from 'react-native';

import { AlertCircleIcon, Text } from '@/components/ui';

export const ErrorScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <AlertCircleIcon size={56} className="text-destructive" />
      <Text className="mt-2 text-center font-bold">
        Oops! Something went wrong
      </Text>
      <Text className="text-center ">
        Please try again or contact support if the problem persists.
      </Text>
    </View>
  );
};
