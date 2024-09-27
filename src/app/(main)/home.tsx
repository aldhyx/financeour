import React from 'react';
import { ScrollView, View } from 'react-native';

import { PlusIcon, WalletIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { Button } from '@/components/ui';

function AccountCard(props: { title: string; balance: number | null }) {
  return (
    <View className="h-24 w-full min-w-44 shrink justify-center rounded-2xl bg-secondary px-3">
      <Text numberOfLines={1}>{props.title}</Text>
      <Text numberOfLines={1} className="text-lg font-semibold">
        Rp. {props.balance}
      </Text>
    </View>
  );
}

function CurrentBalanceSection() {
  return (
    <View className="pl-3">
      <View className="flex-row items-center justify-between gap-4">
        <Text>Jumlah saldo saat ini</Text>

        <Button variant="link" size="sm">
          <View className="flex-row gap-2">
            <Text className="font-bold">Akun saya</Text>
            <WalletIcon className="text-primary dark:text-primary-foreground" />
          </View>
        </Button>
      </View>

      <Text className="text-3xl font-semibold">Rp. 20.000.000</Text>
    </View>
  );
}

function FavoriteAccountSection() {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{ columnGap: 8, paddingHorizontal: 12 }}
      accessibilityHint=""
      showsHorizontalScrollIndicator={false}
    >
      <AccountCard balance={100} title={'Bank XYZ'} />
      <AccountCard balance={100} title={'Bank XYZ'} />
      <AccountCard balance={100} title={'Bank XYZ'} />
      <AccountCard balance={100} title={'Bank XYZ'} />
    </ScrollView>
  );
}

function MonthlySummarySection() {
  return (
    <View className="flex-row gap-2 px-3">
      <AccountCard title="Pendapatan bulanan" balance={1000} />
      <AccountCard title="Pengeluaran bulanan" balance={1000} />
    </View>
  );
}

const HomeScreen = () => {
  return (
    <View className="flex-1 pb-1 pt-2">
      <Button size="icon-lg" className="absolute bottom-4 right-6">
        <PlusIcon className="text-background" />
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
