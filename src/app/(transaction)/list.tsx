import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
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
  const [timestamp, setTimestamp] = useState(() => Date.now());
  const month = dayjs(timestamp).month() + 1;
  const year = dayjs(timestamp).year();

  const { data, isLoading, isError } = useTransactions({
    orderBy: {
      column: 'datetime',
      mode: 'desc',
    },
    datetime: { month, year },
  });

  if (isLoading) return <ActivityIndicator className="flex-1" />;
  if (isError) return <ErrorScreen />;

  return (
    <TransactionList
      data={data}
      currentTimestamp={timestamp}
      setTimestamp={setTimestamp}
    />
  );
}

type TransactionListProps = {
  data: Tx[];
  currentTimestamp: number;
  setTimestamp: (ts: number) => void;
};

const TransactionList = ({
  data,
  currentTimestamp,
  setTimestamp,
}: TransactionListProps) => {
  const { contentAnimatedStyle, iconAnimatedStyle, toggleVisible } =
    useToggleVisible({
      toggleElementHeight: 56, // 40 base height + 16 space height
    });

  return (
    <View className="flex-1">
      <Pressable
        onPress={toggleVisible}
        className="flex-row items-center gap-2 px-4 py-2 active:opacity-50"
      >
        <Text className="shrink text-2xl font-semibold leading-tight">
          {dayjs(currentTimestamp).format('MMMM YYYY')}
        </Text>

        <Animated.View style={iconAnimatedStyle}>
          <ChevronDownIcon className="text-foreground" size={24} />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentAnimatedStyle}>
        <HorizontalMonthCalender
          selectedTimestamp={currentTimestamp}
          onPressMonth={setTimestamp}
        />
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
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <View className="flex-1 px-4">
            <AlertCard
              title="No transactions yet "
              subTitle="Your transactions will appear here, adjust your filters or add a new transaction "
            />
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      />
    </View>
  );
};
