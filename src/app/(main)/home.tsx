import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { TransactionCard } from '@/components/ui/cards/transaction.card';
import { PlusIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAccounts, useTotalBalance } from '@/db/actions/account';
import { useTransactions } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

function CurrentBalanceSection() {
  const router = useRouter();
  const { data } = useTotalBalance();
  const { maskCurrency } = useMaskCurrency();

  return (
    <View className="pl-4 pr-2">
      <View className="flex-row items-center justify-between gap-4">
        <Text>Jumlah saldo saat ini</Text>

        <Button
          variant="link"
          size="sm"
          onPress={() => router.push('/(account)/')}
          className="px-0"
        >
          <View className="flex-row items-center gap-2">
            <Text className="font-medium">Akun saya</Text>
            <WalletIcon className="text-primary" size={20} />
          </View>
        </Button>
      </View>

      <Text className="text-3xl font-semibold leading-none">
        {maskCurrency(data).masked}
      </Text>
    </View>
  );
}

function FavoriteAccountSection() {
  const { push } = useRouter();
  const { data, isLoading, isError } = useAccounts({
    byFavorite: true,
  });
  const { maskCurrency } = useMaskCurrency();
  if (isLoading || isError || data.length === 0) return null;

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{ columnGap: 8, paddingHorizontal: 16 }}
      accessibilityHint=""
      showsHorizontalScrollIndicator={false}
    >
      {data.map((item) => (
        <View
          key={item.id}
          className="h-24 min-w-44 shrink justify-center rounded-2xl bg-secondary px-3"
        >
          <Text numberOfLines={1}>{item.name}</Text>
          <Text numberOfLines={1} className="text-xl font-semibold">
            {maskCurrency(item.balance).masked}
          </Text>
        </View>
      ))}

      <Pressable
        onPress={() => {
          push('/(account)/create');
        }}
        className="h-24 min-w-16 items-center justify-center rounded-2xl px-2 active:bg-secondary"
      >
        <PlusIcon className="text-primary" size={24} />
      </Pressable>
    </ScrollView>
  );
}

function MonthlySummarySection() {
  return (
    <View className="flex-row gap-2 px-4">
      <View className="h-24 w-full shrink justify-center rounded-2xl bg-secondary px-3">
        <Text numberOfLines={1}>Pendapatan bulanan</Text>
        <Text numberOfLines={1} className="text-xl font-semibold">
          Rp. 0
        </Text>
      </View>
      <View className="h-24 w-full shrink justify-center rounded-2xl bg-secondary px-3">
        <Text numberOfLines={1}>Pengeluaran bulanan</Text>
        <Text numberOfLines={1} className="text-xl font-semibold">
          Rp. 0
        </Text>
      </View>
    </View>
  );
}

function RecentTransactionSection() {
  const { data, isLoading } = useTransactions({
    limit: 5,
    orderBy: {
      column: 'datetime',
      mode: 'desc',
    },
  });

  const isEmptyData = !isLoading && data.length === 0;

  return (
    <>
      <View className="mb-2 flex-row items-baseline justify-between gap-1 px-4">
        <Text className="font-semibold leading-none">Transaksi terbaru</Text>

        <Link asChild href="/(transaction)/list" push>
          <Button variant="link" className="px-0" size="sm">
            <Text>Semua transaksi</Text>
          </Button>
        </Link>
      </View>

      {isEmptyData && (
        <View className="px-4">
          <AlertCard
            title="Tidak ada data"
            subTitle="Data transaksi terbaru akan ditampilkan disini."
          />
        </View>
      )}

      {!isEmptyData && (
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
      )}
    </>
  );
}

const HomeScreen = () => {
  return (
    <ScrollView className="flex-1 pb-1">
      <View className="mb-4">
        <CurrentBalanceSection />
      </View>

      <View className="mb-4 gap-2">
        <FavoriteAccountSection />
        <MonthlySummarySection />
      </View>

      <RecentTransactionSection />
    </ScrollView>
  );
};

export default HomeScreen;
