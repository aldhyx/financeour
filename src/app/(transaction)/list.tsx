import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

import { AlertCard } from '@/components/ui/cards/alert.card';
import { TransactionCard } from '@/components/ui/cards/transaction.card';
import { Text } from '@/components/ui/text';
import { useTransactions } from '@/db/actions/transaction';

function EmptyDataScreen() {
  return (
    <View className="flex-1 px-4">
      <Text className="mb-2 font-semibold leading-none">Transaksi terbaru</Text>

      <AlertCard
        title="Tidak ada data"
        subTitle="Data transaksi akan ditampilkan disini."
      />
    </View>
  );
}

const TransactionListScreen = () => {
  const { data, isLoading } = useTransactions({
    limit: 5,
    orderBy: {
      column: 'datetime',
      mode: 'desc',
    },
  });
  const isEmptyData = !isLoading && data.length === 0;

  if (isEmptyData) return <EmptyDataScreen />;

  return (
    <View className="flex-1">
      <FlashList
        data={data}
        renderItem={({ item }) => (
          <TransactionCard
            key={item.id}
            fromAccountName={item.fromAccountName}
            toAccountName={item.toAccountName}
            txAmount={item.amount}
            txType={item.type}
            txDate={item.datetime}
            txId={item.id}
          />
        )}
        estimatedItemSize={data?.length || 1}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </View>
  );
};

export default TransactionListScreen;
