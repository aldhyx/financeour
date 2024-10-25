import { View } from 'react-native';

import { InfoIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export const AlertCard = (props: {
  title: string;
  subTitle?: string;
  className?: string;
}) => {
  return (
    <View
      className={cn('rounded-2xl border border-secondary p-4', props.className)}
    >
      <View className="flex-row gap-2">
        <InfoIcon className="text-foreground" size={24} />

        <View className="shrink">
          <Text className="font-semibold">{props.title}</Text>

          {props.subTitle && (
            <Text className="text-sm leading-tight">{props.subTitle}</Text>
          )}
        </View>
      </View>
    </View>
  );
};
