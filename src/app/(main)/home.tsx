import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { PlusIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAccounts } from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { cn } from '@/lib/utils';

function CurrentBalanceSection() {
  const router = useRouter();

  return (
    <View className="pl-4 pr-2">
      <View className="flex-row items-center justify-between gap-4">
        <Text>Jumlah saldo saat ini</Text>

        <Button
          variant="link"
          size="sm"
          onPress={() => router.push('/(account)/')}
        >
          <View className="flex-row items-center gap-2">
            <Text className="font-medium">Akun saya</Text>
            <WalletIcon className="text-primary" size={20} />
          </View>
        </Button>
      </View>

      <Text className="text-3xl font-semibold">Rp. 20.000.000</Text>
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
          className={cn(
            'h-24 shrink justify-center rounded-2xl bg-secondary px-3 min-w-44'
          )}
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
        className="h-24 min-w-16 items-center justify-center rounded-2xl border border-secondary px-2 active:bg-secondary"
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

const HomeScreen = () => {
  return (
    <View className="flex-1 pb-1">
      <Button size="icon-lg" className="absolute bottom-4 right-6">
        <PlusIcon className="text-background" size={24} />
      </Button>

      <View className="mb-4">
        <CurrentBalanceSection />
      </View>

      <View className="mb-4 gap-2">
        <FavoriteAccountSection />
        <MonthlySummarySection />
      </View>
    </View>
  );
};

export default HomeScreen;
