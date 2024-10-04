import { View } from 'react-native';

import { InfoIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export const AlertCard = (props: { title: string; subTitle?: string }) => {
  return (
    <View className="rounded-2xl border border-secondary p-3">
      <View className="flex-row gap-2">
        <InfoIcon className="text-foreground" size={24} />

        <View>
          <Text className="font-semibold">{props.title}</Text>

          {props.subTitle && <Text className="text-sm">{props.subTitle}</Text>}
        </View>
      </View>
    </View>
  );
};
