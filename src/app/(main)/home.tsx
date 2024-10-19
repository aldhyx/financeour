import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { TransactionCard } from '@/components/ui/cards/transaction.card';
import { ChevronRightIcon, EyeOffIcon, PlusIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAccounts, useTotalBalance } from '@/db/actions/account';
import { useTransactions } from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';

function CurrentBalanceSection() {
  const { data } = useTotalBalance();
  const { maskCurrency } = useMaskCurrency();

  return (
    <View className="rounded-xl bg-secondary px-4 py-5">
      <Pressable className="absolute right-2 top-2 size-12 items-center justify-center rounded-full active:bg-foreground/10">
        <EyeOffIcon className="text-primary" size={24} />
      </Pressable>

      <Text className="mb-1">Total account balance</Text>
      <Text className="text-3xl font-semibold">
        {maskCurrency(data).masked}
      </Text>

      <View className="my-3 h-px w-full bg-background" />

      <View className="flex-row gap-4">
        <View className="w-full shrink justify-center rounded-xl">
          <Text numberOfLines={1} className="text-sm">
            Monthly Income
          </Text>
          <Text numberOfLines={1} className="font-semibold">
            Rp. 0
          </Text>
        </View>
        <View className="w-full shrink justify-center rounded-xl">
          <Text numberOfLines={1} className="text-sm">
            Monthly Expense
          </Text>
          <Text numberOfLines={1} className="font-semibold">
            Rp. 0
          </Text>
        </View>
      </View>
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
      contentContainerStyle={{ columnGap: 4, paddingHorizontal: 16 }}
      accessibilityHint=""
      showsHorizontalScrollIndicator={false}
    >
      {data.map((item) => (
        <View
          key={item.id}
          className="h-20 min-w-40 shrink justify-center rounded-xl bg-secondary px-3"
        >
          <Text numberOfLines={1} className="text-sm">
            {item.name}
          </Text>
          <Text numberOfLines={1} className="text-base font-semibold">
            {maskCurrency(item.balance).masked}
          </Text>
        </View>
      ))}

      <Pressable
        onPress={() => {
          push('/(account)/create');
        }}
        className="h-20 min-w-16 items-center justify-center rounded-xl border border-dashed border-border px-2 active:bg-secondary"
      >
        <PlusIcon className="text-muted-foreground" size={24} />
      </Pressable>
    </ScrollView>
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
      <View className="mb-1 flex-row items-baseline justify-between gap-1 px-4">
        <Text className="font-semibold">Recent transactions</Text>

        <Link asChild href="/(transaction)/list" push>
          <Button variant="link" className="flex-row gap-1 px-0" size="sm">
            <Text className="font-semibold">View all</Text>
            <ChevronRightIcon className="text-primary" size={18} />
          </Button>
        </Link>
      </View>

      {isEmptyData && (
        <View className="px-4">
          <AlertCard
            title="It’s quite here"
            subTitle="There are no recent transactions."
          />
        </View>
      )}

      {!isEmptyData && (
        <View className="gap-2">
          {data.map((item) => (
            <TransactionCard
              key={item.id}
              fromAccountName={item.fromAccountName}
              toAccountName={item.toAccountName}
              txAmount={item.amount}
              txType={item.type}
              txDate={item.datetime}
              txId={item.id}
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
      <View className="mb-1 px-4">
        <CurrentBalanceSection />
      </View>

      <View className="mb-1 gap-1">
        <FavoriteAccountSection />
      </View>

      <RecentTransactionSection />
    </ScrollView>
  );
};

export default HomeScreen;
