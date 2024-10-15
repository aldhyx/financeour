import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HorizontalMonthCalender } from '@/components/tools/horizontal-month-calendar';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { TransactionCard } from '@/components/ui/cards/transaction.card';
import { ChevronDownIcon } from '@/components/ui/icon';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import { Text } from '@/components/ui/text';
import { Tx, useTransactions } from '@/db/actions/transaction';
import { useToggleVisible } from '@/hooks/use-toggle-visible';

export default function TransactionListScreen() {
  const { data, isLoading, isError } = useTransactions({
    limit: 5,
    orderBy: {
      column: 'datetime',
      mode: 'desc',
    },
  });
  if (isLoading) return <ActivityIndicator className="flex-1" />;
  if (isError) return <ErrorScreen />;

  console.log('total data', data.length);
  return <TransactionList data={data} />;
}

const TransactionList = ({ data }: { data: Tx[] }) => {
  const { contentAnimatedStyle, iconAnimatedStyle, toggleVisible } =
    useToggleVisible({ toggleElementHeight: 56 });

  const changeMonthHandler = useCallback((timestamp: number) => {
    Alert.alert(`${dayjs(timestamp).format('MMMM YYYY')}`);
  }, []);

  console.log('rerender');
  return (
    <View className="flex-1">
      <Pressable
        onPress={toggleVisible}
        className="flex-row items-center gap-2 px-4 py-2 active:opacity-50"
      >
        <Text className="shrink text-xl font-semibold leading-tight">
          Oktober 2024
        </Text>

        <Animated.View style={iconAnimatedStyle}>
          <ChevronDownIcon className="text-foreground" size={24} />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentAnimatedStyle}>
        <View className="pb-4">
          <HorizontalMonthCalender onPressMonth={changeMonthHandler} />
        </View>
      </Animated.View>

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
        ListEmptyComponent={
          <View className="flex-1 px-4">
            <AlertCard
              title="Tidak ada data"
              subTitle="Data transaksi akan ditampilkan disini."
            />
          </View>
        }
      />
    </View>
  );
};
