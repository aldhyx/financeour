import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import {
  DeleteTransactionSheet,
  DeleteTransactionSheetProvider,
  useDeleteTransactionSheetContext,
} from '@/components/action-sheets/transaction/delete-transaction.sheet';
import { Button } from '@/components/ui/button';
import {
  txTypeColors,
  txTypeIcons,
} from '@/components/ui/cards/transaction.card';
import { HeaderBar } from '@/components/ui/header-bar';
import { TrashIcon } from '@/components/ui/icon';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import { Text } from '@/components/ui/text';
import { TRANSACTION_TYPES_LABEL } from '@/constants/app';
import { Tx, useTransactionByID } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { dateToString } from '@/lib/dayjs';

export default function DetailTransactionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data, error, isLoading } = useTransactionByID(params.id);

  if (error) return <ErrorScreen />;
  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!data) return null;

  return (
    <DeleteTransactionSheetProvider>
      <DeleteTransactionSheet />
      <DetailTransaction data={data} />
    </DeleteTransactionSheetProvider>
  );
}
function DetailTransaction({ data: tx }: { data: Tx }) {
  const { sheetPresent: showDeleteTxSheet } =
    useDeleteTransactionSheetContext();
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
        <TrashIcon size={20} className="text-destructive" />
      </Button>
    );
  }, [showDeleteTxSheet, tx.id]);

  const isTransfer = Boolean(tx.type === 'tf' && tx.toAccountName);
  const txColor = txTypeColors[tx.type];
  const TxIcon = txTypeIcons[tx.type];
  const txLabel = TRANSACTION_TYPES_LABEL[tx.type];

  return (
    <View className="px-4 pt-2">
      <Stack.Screen
        options={{
          title: 'Rincian transaksi',
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
          <Text className="text-sm text-muted-foreground">Akun</Text>
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
            Tanggal transaksi
          </Text>
          <Text>{dateToString(tx.datetime)}</Text>
        </View>

        <View className="mb-3 gap-1 px-3">
          <Text className="text-sm text-muted-foreground">Kategori</Text>
          <Text>Belanja</Text>
        </View>

        <View className="gap-1 px-3">
          <Text className="text-sm text-muted-foreground">Keterangan</Text>
          <Text>{tx.description || '-'}</Text>
        </View>
      </View>

      <Text className="mt-4 text-center text-xs text-muted-foreground">
        Dibuat pada: {tx.createdAt}
      </Text>
    </View>
  );
}
