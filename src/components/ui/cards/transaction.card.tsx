import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import {
  getTransactionColor,
  getTransactionIcon,
} from '@/constants/transaction-types';
import { Tx } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

type Props = {
  fromAccountName: Tx['fromAccountName'];
  toAccountName: Tx['toAccountName'];
  txAmount: Tx['amount'];
  txType: Tx['type'];
  txDate: Tx['datetime'];
  txId: Tx['id'];
};

export const TransactionCard = (props: Props) => {
  const { maskCurrency } = useMaskCurrency();
  const TxIcon = getTransactionIcon(props.txType);
  const txColor = getTransactionColor(props.txType);
  const router = useRouter();

  return (
    <Pressable
      className="justify-center p-4 active:opacity-50"
      onPress={() => router.push(`/(transaction)/${props.txId}`)}
    >
      <View className="flex-row items-center justify-between gap-4">
        <View className="shrink flex-row items-center gap-2">
          <Text>🛍️</Text>
          <Text className="shrink font-medium" numberOfLines={1}>
            {props.fromAccountName}
            {props.toAccountName && ` - ${props.toAccountName}`}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Text className={`text-forefill-foreground font-semibold ${txColor}`}>
            {maskCurrency(props.txAmount).masked}
          </Text>

          <TxIcon size={20} className={`${txColor}`} />
        </View>
      </View>
    </Pressable>
  );
};
