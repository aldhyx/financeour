import { useRouter } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EllipsisIcon, StarIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Account } from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { cn } from '@/lib/utils';

type Props = {
  onPressFavorite: (id: string, isFavorite: boolean) => void;
  onPressAction: (props: Account) => void;
} & Account;

export const AccountCard = memo((props: Props) => {
  const { maskCurrency } = useMaskCurrency();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/(account)/${props.id}`)}>
      <View className="rounded-2xl border border-secondary bg-secondary">
        <View
          className="border border-secondary bg-background px-4 py-1"
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 16,
            left: -1,
            top: -14,
            position: 'absolute',
          }}
        >
          <Text className="text-sm capitalize">{props.type}</Text>
        </View>

        <View className="flex-row items-start justify-between gap-2 px-3 py-4">
          <View className="shrink">
            <Text className="pt-2">{props.name}</Text>
            <Text className="text-xl font-semibold">
              {maskCurrency(props.balance).masked}
            </Text>
          </View>

          <View className="flex-row" style={{ right: -5 }}>
            <Button
              size="icon"
              variant="ghost"
              onPress={() =>
                props.onPressFavorite(props.id, !Boolean(props.isFavorite))
              }
            >
              <StarIcon
                className={cn(
                  'text-foreground',
                  props.isFavorite && 'fill-foreground'
                )}
                size={20}
              />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onPress={() =>
                props.onPressAction({
                  id: props.id,
                  name: props.name,
                  balance: props.balance,
                  type: props.type,
                  description: props.description,
                  isFavorite: props.isFavorite,
                  createdAt: props.createdAt,
                  updatedAt: props.updatedAt,
                })
              }
            >
              <EllipsisIcon className="text-foreground " size={20} />
            </Button>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

AccountCard.displayName = 'AccountCard';
