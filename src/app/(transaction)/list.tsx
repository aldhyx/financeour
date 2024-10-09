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
  });
  const isEmptyData = !isLoading && data.length === 0;

  if (isEmptyData) return <EmptyDataScreen />;

  return (
    <View className="flex-1 pt-2">
      <View className="px-4">
        <Text className="mb-3 font-semibold leading-none">
          Riwayat transaksi
        </Text>
      </View>

      <View className="gap-3">
        {data.map((item) => (
          <TransactionCard
            key={item.id}
            fromAccountName={item.fromAccountName}
            toAccountName={item.toAccountName}
            txAmount={item.amount}
            txType={item.type}
            txDate={item.datetime}
          />
        ))}
      </View>
    </View>
  );
};

export default TransactionListScreen;
