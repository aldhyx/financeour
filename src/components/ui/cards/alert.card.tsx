import { View } from 'react-native';

import { InfoIcon, Text } from '@/components/ui';

export const AlertCard = (props: { title: string; subTitle?: string }) => {
  return (
    <View className="rounded-2xl border border-secondary p-3">
      <View className="flex-row gap-2">
        <InfoIcon className="text-foreground" />

        <View>
          <Text className="font-semibold">{props.title}</Text>

          {props.subTitle && <Text className="sm">{props.subTitle}</Text>}
        </View>
      </View>
    </View>
  );
};
