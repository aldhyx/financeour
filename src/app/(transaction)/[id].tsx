import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import dayjs from 'dayjs';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useDeleteTransactionSheetContext } from '@/components/action-sheets/transaction/delete-transaction.sheet';
import { Button } from '@/components/ui/button';
import { HeaderBar } from '@/components/ui/header-bar';
import { TrashIcon } from '@/components/ui/icon';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import { Text } from '@/components/ui/text';
import {
  getTransactionColor,
  getTransactionIcon,
  getTransactionLabel,
} from '@/constants/transaction-types';
import { Tx, useTransactionByID } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

export default function DetailTransactionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data, error, isLoading } = useTransactionByID(params.id);

  if (error) return <ErrorScreen />;
  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!data) return null;

  return <DetailTransaction data={data} />;
}

function DetailTransaction({ data: tx }: { data: Tx }) {
  const { _ } = useLingui();
  const { showSheet: showDeleteTxSheet } = useDeleteTransactionSheetContext();
  const { maskCurrency } = useMaskCurrency();

  const rightIcon = useMemo(() => {
    return (
      <Button
        variant="ghost"
        size="icon-md"
        rounded="full"
        style={{ right: -6 }}
        onPress={() => {
          showDeleteTxSheet({ id: tx.id });
        }}
      >
        <TrashIcon size={20} className="text-red-500" />
      </Button>
    );
  }, [showDeleteTxSheet, tx.id]);

  const isTransfer = Boolean(tx.type === 'tf' && tx.toAccountName);
  const txColor = getTransactionColor(tx.type);
  const TxIcon = getTransactionIcon(tx.type);
  const txLabelTrans = getTransactionLabel(tx.type);
  const txLabel = _(txLabelTrans);

  return (
    <View className="px-4 pt-2">
      <Stack.Screen
        options={{
          title: _(msg`Detail transaction`),
          header({ options }) {
            return (
              <HeaderBar
                title={options.title}
                leftIcon="back"
                rightIcon={rightIcon}
              />
            );
          },
        }}
      />
      <View className={`rounded-2xl border border-dashed border-border py-4`}>
        <View className="mb-2 px-3">
          <Text className="text-sm text-muted-foreground">
            <Trans>Account</Trans>
          </Text>
          <View className="flex-row items-start">
            <Text className="text-lg font-bold">{tx.fromAccountName}</Text>

            {isTransfer && (
              <Text className="text-lg font-bold"> - {tx.toAccountName}</Text>
            )}
          </View>
        </View>

        <View className={`mb-4 border-b border-dashed border-border px-3 pb-4`}>
          <Text className="text-sm text-muted-foreground">{txLabel}</Text>
          <View className="flex-row items-center gap-1">
            <TxIcon size={20} className={`${txColor}`} />

            <Text className={`text-2xl font-bold ${txColor}`}>
              {maskCurrency(tx.amount).masked}
            </Text>
          </View>
        </View>

        <View className="mb-3 gap-1 px-3">
          <Text className="text-sm text-muted-foreground">
            <Trans>Transaction date</Trans>
          </Text>
          <Text>{dayjs(tx.datetime).format('dddd, D MMMM YYYY')}</Text>
        </View>

        <View className="mb-3 gap-1 px-3">
          <Text className="text-sm text-muted-foreground">
            <Trans>Category</Trans>
          </Text>
          <Text>Shopping</Text>
        </View>

        <View className="gap-1 px-3">
          <Text className="text-sm text-muted-foreground">
            <Trans>Description</Trans>
          </Text>
          <Text>{tx.description || '-'}</Text>
        </View>
      </View>

      <Text className="mt-4 text-center text-xs text-muted-foreground">
        <Trans>Created at: {tx.createdAt}</Trans>
      </Text>
    </View>
  );
}
