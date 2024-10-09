import React from 'react';
import { Pressable, View } from 'react-native';

import {
  ArrowBigDownIcon,
  ArrowBigRightIcon,
  ArrowBigUpIcon,
} from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Tx } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

type Props = {
  fromAccountName: Tx['fromAccountName'];
  toAccountName: Tx['toAccountName'];
  txAmount: Tx['amount'];
  txType: Tx['type'];
};

const txTypeIcons = {
  in: ArrowBigDownIcon,
  out: ArrowBigUpIcon,
  tf: ArrowBigRightIcon,
} as const;

const txTypeColors = {
  in: 'text-green-600 fill-green-600',
  out: 'text-red-600 fill-red-600',
  tf: 'text-magenta-600 fill-magenta-600',
} as const;

export const TransactionCard = (props: Props) => {
  const { maskCurrency } = useMaskCurrency();
  const TxIcon = txTypeIcons[props.txType];
  const txColor = txTypeColors[props.txType];
  return (
    <Pressable className="active:opacity-50">
      <View className="gap-1">
        <View className="flex-row justify-between gap-2 ">
          <Text className="text-sm">Belanja</Text>
          <Text className="text-sm">Senin, 2 Oktober 2024</Text>
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <Text className="font-semibold">
            {props.fromAccountName}
            {props.toAccountName && ` - ${props.toAccountName}`}
          </Text>

          <View className="flex-row items-center gap-1">
            <Text
              className={`text-forefill-foreground font-semibold ${txColor}`}
            >
              {maskCurrency(props.txAmount).masked}
            </Text>

            <TxIcon
              size={20}
              className={`text-forefill-foreground fill-foreground ${txColor}`}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};
