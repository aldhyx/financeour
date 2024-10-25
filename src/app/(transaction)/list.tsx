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
import {
  useTransactionGroupedByDay,
  useTransactions,
} from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { useToggleVisible } from '@/hooks/use-toggle-visible';
import { cn } from '@/lib/utils';

export default function TransactionListScreen() {
  const [timestamp, setTimestamp] = useState(() => Date.now());

  const { contentAnimatedStyle, iconAnimatedStyle, toggleVisible } =
    useToggleVisible({
      toggleElementHeight: 56, // 40 base height + 16 space height
      defaultVisible: false,
    });

  return (
    <View className="flex-1">
      <Pressable
        onPress={toggleVisible}
        className="flex-row items-center gap-1 px-4 py-2 active:opacity-50"
      >
        <Text className="shrink text-2xl font-semibold leading-tight">
          {dayjs(timestamp).format('MMMM YYYY')}
        </Text>

        <Animated.View style={iconAnimatedStyle}>
          <ChevronDownIcon className="text-foreground" size={18} />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentAnimatedStyle}>
        <HorizontalMonthCalender
          selectedTimestamp={timestamp}
          onPressMonth={setTimestamp}
        />
      </Animated.View>

      <TransactionList timestamp={timestamp} />
    </View>
  );
}

const TransactionList = ({ timestamp }: { timestamp: number }) => {
  const month = dayjs(timestamp).month() + 1;
  const year = dayjs(timestamp).year();

  const { data, isLoading, isError } = useTransactionGroupedByDay({
    datetime: { month, year },
  });

  if (isLoading) return <ActivityIndicator className="flex-1" />;
  if (isError) return <ErrorScreen />;

  return (
    <View className="flex-1">
      <FlashList
        ListHeaderComponent={<MonthlySummarizeCard month={month} year={year} />}
        data={data}
        renderItem={TransactionListItem}
        estimatedItemSize={data?.length || 1}
        ItemSeparatorComponent={() => <View className="h-px bg-background" />}
        ListEmptyComponent={
          <View className="px-4">
            <AlertCard
              title="No transactions yet "
              subTitle="Your transactions will appear here, adjust your filters or add a new transaction "
            />
          </View>
        }
      />
    </View>
  );
};

const TransactionListItem = ({
  item,
}: {
  item: ReturnType<typeof useTransactionGroupedByDay>['data'][number];
}) => {
  if (typeof item === 'string') {
    //  its a group title
    return <Text className="mb-2 px-4 text-sm leading-tight">{item}</Text>;
  }

  return (
    <View
      className={cn(
        'bg-secondary mx-4',
        item.isEnd && 'mb-4 rounded-b-2xl',
        item.isStart && 'rounded-t-2xl'
      )}
    >
      <TransactionCard
        key={item.id}
        fromAccountName={item.fromAccountName}
        toAccountName={item.toAccountName}
        txAmount={item.amount}
        txType={item.type}
        txDate={item.datetime}
        txId={item.id}
      />
    </View>
  );
};

const MonthlySummarizeCard = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const { maskCurrency } = useMaskCurrency();
  const { isLoading, data, isError } = useTransactions({
    datetime: { month, year },
  });
  if (isError || isLoading) return null;

  const { expense, income } = data.reduce(
    (acc, curr) => {
      if (curr.type === 'in') {
        acc.income += curr.amount;
      }

      if (curr.type === 'out') {
        acc.expense += curr.amount;
      }

      return acc;
    },
    { income: 0, expense: 0 }
  );

  return (
    <View className="mb-4 flex-row gap-2 px-4">
      <View className="flex-1">
        <Text>Total Income</Text>
        <Text className="text-xl font-semibold leading-tight">
          {maskCurrency(income).masked}
        </Text>
      </View>

      <View className="flex-1">
        <Text>Total Expense</Text>
        <Text className="text-xl font-semibold leading-tight">
          {maskCurrency(expense).masked}
        </Text>
      </View>
    </View>
  );
};
