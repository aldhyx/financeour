import { useNavigation, useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { Button, ChevronLeftIcon, Text, XIcon } from '@/components/ui';

type HeaderBarProps = {
  title?: string;
  leftIcon?: 'back' | 'cancel';
  rightIcon?: ReactNode;
};

export const HeaderBar = ({
  leftIcon = 'back',
  rightIcon,
  title,
}: HeaderBarProps) => {
  const router = useRouter();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const showBackButton = canGoBack && navigation.getState().type === 'stack';

  return (
    <View className="h-14 flex-row items-center justify-between gap-4 bg-background px-4">
      <View
        className="flex-row items-center gap-6"
        style={{ left: showBackButton ? -8 : 0 }}
      >
        {showBackButton && (
          <Button size="icon-md" variant="ghost" onPress={router.back}>
            {leftIcon === 'cancel' && (
              <XIcon size={28} className="text-foreground" />
            )}
            {leftIcon === 'back' && (
              <ChevronLeftIcon size={28} className="text-foreground" />
            )}
          </Button>
        )}

        {Boolean(title) && (
          <Text className="text-center text-2xl font-semibold">{title}</Text>
        )}
      </View>

      {rightIcon ? rightIcon : null}
    </View>
  );
};
