import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  initialScrollIndex: number;
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

  return {
    calendarItems,
    currentMonthIndex,
    initialScrollIndex: currentMonthIndex - 1,
  };
};

const YearCard = ({ year }: { year: number }) => {
  return (
    <View className="h-10 w-20 justify-center rounded-full">
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
  onPress: (t: number, i: number) => void;
}) => {
  if (!timestamp) return null;

  const isSelected = selectedTimestamp
    ? dayjs(timestamp).isSame(selectedTimestamp, 'month')
    : monthIndex === currentMonthIndex;

  return (
    <Pressable
      className="active:opacity-50"
      onPress={() => onPress(timestamp, monthIndex)}
    >
      <View
        className={cn(
          'h-10 w-20 justify-center rounded-full',
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

export const HorizontalMonthCalender = memo(
  ({
    onPressMonth,
    selectedTimestamp,
  }: {
    onPressMonth: (timestamp: number) => void;
    selectedTimestamp?: number;
  }) => {
    const { calendarItems, currentMonthIndex, initialScrollIndex } = useMemo(
      generateCalendarData,
      []
    );
    const [loaded, setLoaded] = useState(false);
    const ref = useRef<FlashList<CalendarItems>>(null);

    useEffect(() => {
      // Will be trigger twice, when first component mount & flashlist loaded
      // when flashlist loaded, scroll to initial index with no animation
      if (loaded) {
        ref.current?.scrollToIndex({
          index: initialScrollIndex,
        });
      }
    }, [loaded, initialScrollIndex]);

    const pressItemHandler = useCallback(
      (timestamp: number, itemIndex: number) => {
        ref.current?.scrollToIndex({
          index: itemIndex - 1,
          animated: true,
        });
        onPressMonth(timestamp);
      },
      [onPressMonth]
    );

    return (
      <View className="h-10">
        <FlashList
          ref={ref}
          onLoad={() => {
            setLoaded(true);
          }}
          data={calendarItems}
          keyExtractor={(item, index) => `${item.type}-${item.year}-${index}`}
          horizontal
          extraData={{ selectedTimestamp, currentMonthIndex, pressItemHandler }}
          renderItem={(props) => {
            if (props.item.type === 'year') {
              return <YearCard year={props.item.year} />;
            }

            return (
              <MonthCard
                timestamp={props.item.timestamp}
                monthIndex={props.index}
                currentMonthIndex={props.extraData.currentMonthIndex}
                selectedTimestamp={props.extraData.selectedTimestamp}
                onPress={props.extraData.pressItemHandler}
              />
            );
          }}
          estimatedItemSize={84} // card with + separator
          ItemSeparatorComponent={() => <View className="h-10 w-1" />}
          showsHorizontalScrollIndicator={false}
          // NOTE: idk why this make the scroll item shake at first render, so the trick is using useEffect + useRef + loaded state
          // estimatedFirstItemOffset={84 * initialScrollIndex}
          // initialScrollIndex={initialScrollIndex}
        />
      </View>
    );
  }
);
