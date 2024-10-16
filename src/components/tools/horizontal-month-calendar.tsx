import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { FlatList } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const generateCalendarData = () => {
  const now = dayjs();
  const nowYear = now.year();
  const nowMonth = now.month();

  const startYear = 2000;
  const endYear = nowYear + 10;
  const totalYears = endYear - startYear + 1;

  const calendarItems = [];

  let currentMonthIndex = -1; // Initialize the current month index
  let index = 0; // Track the position during iteration

  // Generate years and months
  for (let i = 0; i < totalYears; i++) {
    const year = startYear + i;
    calendarItems.push({ type: 'year', year });
    index++; // Increment index for the year

    for (let month = 0; month < 12; month++) {
      const timestamp = Date.UTC(year, month);
      calendarItems.push({ type: 'month', year, timestamp });

      // Calculate the current month index inline
      if (year === nowYear && month === nowMonth) {
        currentMonthIndex = index;
      }
      index++; // Increment index for each month
    }
  }

  return { calendarItems, currentMonthIndex };
};

const YearCard = ({ year }: { year: number }) => {
  return (
    <View className="h-10 w-20 justify-center rounded-xl">
      <Text className="text-center">{year}</Text>
    </View>
  );
};

const MonthCard = ({
  currentMonthIndex,
  monthIndex,
  timestamp,
  selectedTimestamp,
  onPress,
}: {
  timestamp?: number;
  monthIndex: number;
  currentMonthIndex: number;
  selectedTimestamp?: number;
  onPress: (t: number) => void;
}) => {
  if (!timestamp) return null;

  const isSelected = selectedTimestamp
    ? dayjs(timestamp).isSame(selectedTimestamp, 'month')
    : monthIndex === currentMonthIndex;

  return (
    <Pressable
      className={cn(!isSelected && 'active:opacity-50')}
      onPress={() => onPress(timestamp)}
    >
      <View
        className={cn(
          'h-10 w-20 justify-center rounded-xl',
          isSelected ? 'bg-primary' : 'bg-secondary'
        )}
      >
        <Text
          className={cn(
            'text-center',
            isSelected && 'font-semibold text-primary-foreground'
          )}
        >
          {dayjs(timestamp).format('MMM')}
        </Text>
      </View>
    </Pressable>
  );
};

const Separator = () => <View className="h-10 w-1" />;

export const HorizontalMonthCalender = memo(
  ({
    onPressMonth,
    selectedTimestamp,
  }: {
    onPressMonth: (timestamp: number) => void;
    /**
     * Default {now month}
     */
    selectedTimestamp?: number;
  }) => {
    const { calendarItems, currentMonthIndex } = useMemo(
      generateCalendarData,
      []
    );

    return (
      <FlatList
        data={calendarItems}
        renderItem={({ item, index }) => {
          if (item.type === 'year') return <YearCard year={item.year} />;

          return (
            <MonthCard
              timestamp={item.timestamp}
              monthIndex={index}
              currentMonthIndex={currentMonthIndex}
              selectedTimestamp={selectedTimestamp}
              onPress={onPressMonth}
            />
          );
        }}
        keyExtractor={(item, index) => `${item.type}-${item.year}-${index}`}
        horizontal
        getItemLayout={(_, index) => ({
          length: 84, // card with
          offset: index * (80 + 4), // card with + separator
          index,
        })}
        initialScrollIndex={currentMonthIndex - 1}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
      />
    );
  }
);
