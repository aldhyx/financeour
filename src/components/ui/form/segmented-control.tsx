import { Trans as TransLazy } from '@lingui/react';
import React, { Dispatch, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Refers to return type msg
 */
type MessageDescriptor = {
  id: string;
  comment?: string;
  message?: string;
  values?: Record<string, unknown>;
};

type Segment = {
  id: string;
  label: MessageDescriptor;
};

type Props<T extends Segment> = {
  segments: T[];
  defaultIndex: number;
  onValueChange: Dispatch<T>;
};

const SegmentedControl = <T extends Segment>(props: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState(props.defaultIndex);

  const { width: windowWidth } = useWindowDimensions();
  const segmentWidth = (windowWidth - 32 - 8) / props.segments.length; // windowWidth - outer padding * 2 - inner padding * 2;

  const styles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(selectedIndex * segmentWidth + 4, {
          duration: 250,
        }), // selectedIndex * segmentWidth + inner padding;
      },
    ],
  }));

  return (
    <View
      className={cn(
        'h-12 flex-row rounded-full bg-secondary overflow-hidden px-1'
      )}
    >
      <Animated.View
        className={cn('absolute h-10 rounded-full bg-background top-1')}
        style={[
          {
            width: segmentWidth,
          },
          styles,
        ]}
      />
      {props.segments.map((segment, index) => {
        const selected = selectedIndex === index;
        return (
          <Pressable
            key={`${index}${segment}`}
            className="active:opacity-50"
            style={{ width: segmentWidth }}
            onPress={() => {
              props.onValueChange(segment);
              setSelectedIndex(index);
            }}
          >
            <View className="h-full items-center justify-center rounded-full">
              <Text className={cn(selected ? 'font-semibold' : 'opacity-75')}>
                <TransLazy id={segment.label.id} />
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
