import { memo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';

import { Text } from '../text';

type SegmentedOption = {
  key: string | any;
  label: string;
};

type SegmentedControlProps<T extends SegmentedOption> = {
  options: T[];
  selectedOption: T;
  onOptionPress: (option: T) => void;
};

export const SegmentedControl = memo(
  <T extends SegmentedOption>({
    options,
    onOptionPress,
    selectedOption,
  }: SegmentedControlProps<T>) => {
    const { width: windowWidth } = useWindowDimensions();

    const innerPadding = 8; // this is the SegmentedControl inner padding left + right (4+4)
    const segmentedControlWidth = windowWidth - 32; // window width - outer left right padding * 2 (16*2)
    const itemWidth = (segmentedControlWidth - innerPadding) / options.length;

    const rStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          itemWidth *
            options.findIndex((option) => option.key === selectedOption.key) +
            innerPadding / 2
        ),
      };
    });

    return (
      <View
        className="mb-4 h-12 flex-row rounded-2xl bg-secondary"
        style={[
          { width: segmentedControlWidth, paddingLeft: innerPadding / 2 },
        ]}
      >
        <Animated.View
          className="absolute rounded-xl bg-background"
          style={[
            styles.activeBox,
            rStyle,
            {
              width: itemWidth,
            },
          ]}
        />
        {options.map((option) => (
          <TouchableOpacity
            onPress={() => onOptionPress(option)}
            style={[styles.segmentedItem, { width: itemWidth }]}
            key={option.key}
            activeOpacity={option.key === selectedOption.key ? 1 : 0.75}
          >
            <Text
              className={cn(option.key !== selectedOption.key && 'opacity-70')}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
);
SegmentedControl.displayName = 'SegmentedControl';

const styles = StyleSheet.create({
  activeBox: {
    height: 48 - 8, // container height - inner top & bottom padding
    top: 4,
    elevation: 1,
  },
  segmentedItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
