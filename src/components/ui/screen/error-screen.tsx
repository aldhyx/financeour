import { Trans } from '@lingui/macro';
import { View } from 'react-native';

import { AlertCircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export const ErrorScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <AlertCircleIcon size={56} className="text-destructive" />
      <Text className="mt-2 text-center font-bold">
        <Trans>Oops! Something went wrong</Trans>
      </Text>
      <Text className="text-center ">
        <Trans>
          Please try again or contact support if the problem persists.
        </Trans>
      </Text>
    </View>
  );
};
