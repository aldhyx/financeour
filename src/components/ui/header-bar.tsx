import { useNavigation, useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, XIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type HeaderBarProps = {
  title?: string;
  leftIcon?: 'back' | 'cancel';
  rightIcon?: ReactNode;
};

const LEFT_ICONS = {
  back: ChevronLeftIcon,
  cancel: XIcon,
};

export const HeaderBar = ({
  leftIcon = 'back',
  rightIcon,
  title,
}: HeaderBarProps) => {
  /**
   * there is a bug which will auto hide this header when theme changed
   * so we need to set a margin top from setAreaInset.top
   */
  const { top } = useSafeAreaInsets();

  const router = useRouter();
  const navigation = useNavigation();
  const showBackButton =
    navigation.canGoBack() && navigation.getState().type === 'stack';

  const Icon = LEFT_ICONS[leftIcon];

  return (
    <View
      className="h-14 flex-row items-center justify-between gap-4 bg-background px-4"
      style={{ marginTop: top }}
    >
      <View
        className="flex-row items-center gap-6"
        style={{ left: showBackButton ? -8 : 0 }}
      >
        {showBackButton && (
          <Button
            size="icon-md"
            variant="ghost"
            onPress={router.back}
            rounded="full"
          >
            <Icon size={28} className="text-foreground" />
          </Button>
        )}

        {Boolean(title) && (
          <Text className="text-center text-lg font-semibold">{title}</Text>
        )}
      </View>

      {rightIcon ? rightIcon : null}
    </View>
  );
};
