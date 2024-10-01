import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { PlusIcon, WalletIcon } from '@/components/ui';
import { Text } from '@/components/ui';
import { Button } from '@/components/ui';

function AccountCard(props: { title: string; balance: number | null }) {
  return (
    <View className="h-24 w-full min-w-44 shrink justify-center rounded-2xl bg-secondary px-3">
      <Text numberOfLines={1}>{props.title}</Text>
      <Text numberOfLines={1} className="text-xl font-semibold">
        Rp. {props.balance}
      </Text>
    </View>
  );
}

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
          <View className="flex-row gap-2">
            <Text className="font-bold">Akun saya</Text>
            <WalletIcon className="text-primary" size={20} />
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
      contentContainerStyle={{ columnGap: 8, paddingHorizontal: 16 }}
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
    <View className="flex-row gap-2 px-4">
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
