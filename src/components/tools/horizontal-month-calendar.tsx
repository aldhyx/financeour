import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type CalendarItems =
  | {
      type: 'month';
      year: number;
      timestamp: number;
    }
  | {
      type: 'year';
      year: number;
    };

type GenerateCalendarData = () => {
  currentMonthIndex: number;
  calendarItems: CalendarItems[];
};

const generateCalendarData: GenerateCalendarData = () => {
  const now = dayjs();
  const nowYear = now.year();
  const nowMonth = now.month();

  const startYear = 2000;
  const endYear = nowYear + 30;
  const totalYears = endYear - startYear + 1;

  const calendarItems: CalendarItems[] = [];

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
    <Pressable className="active:opacity-50" onPress={() => onPress(timestamp)}>
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
    selectedTimestamp?: number;
  }) => {
    const { calendarItems, currentMonthIndex } = useMemo(
      generateCalendarData,
      []
    );

    return (
      <View className="h-10">
        <FlashList
          data={calendarItems}
          keyExtractor={(item, index) => `${item.type}-${item.year}-${index}`}
          horizontal
          extraData={selectedTimestamp}
          renderItem={(props) => {
            if (props.item.type === 'year') {
              return <YearCard year={props.item.year} />;
            }

            return (
              <MonthCard
                timestamp={props.item.timestamp}
                monthIndex={props.index}
                currentMonthIndex={currentMonthIndex}
                selectedTimestamp={selectedTimestamp}
                onPress={onPressMonth}
              />
            );
          }}
          estimatedItemSize={84} // card with + separator
          ItemSeparatorComponent={Separator}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentMonthIndex - 1}
        />
      </View>
    );
  }
);
