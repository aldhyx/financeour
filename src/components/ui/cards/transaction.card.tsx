import { useRouter } from 'expo-router';
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
import { dateToString } from '@/lib/dayjs';

type Props = {
  fromAccountName: Tx['fromAccountName'];
  toAccountName: Tx['toAccountName'];
  txAmount: Tx['amount'];
  txType: Tx['type'];
  txDate: Tx['datetime'];
  txId: Tx['id'];
};

export const txTypeIcons = {
  in: ArrowBigDownIcon,
  out: ArrowBigUpIcon,
  tf: ArrowBigRightIcon,
} as const;

export const txTypeColors = {
  in: 'text-green-600 fill-green-600',
  out: 'text-red-600 fill-red-600',
  tf: 'text-amber-600 fill-amber-600',
} as const;

export const TransactionCard = (props: Props) => {
  const { maskCurrency } = useMaskCurrency();
  const TxIcon = txTypeIcons[props.txType];
  const txColor = txTypeColors[props.txType];
  const dateString = dateToString(props.txDate);
  const router = useRouter();

  console.log('TransactionCard');
  return (
    <Pressable
      className="active:opacity-50"
      onPress={() => router.push(`/(transaction)/${props.txId}`)}
    >
      <View className="gap-1 px-4">
        <View className="flex-row justify-between gap-2 ">
          <Text className="text-sm">Belanja</Text>
          <Text className="text-sm">{dateString}</Text>
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

            <TxIcon size={20} className={`${txColor}`} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};
