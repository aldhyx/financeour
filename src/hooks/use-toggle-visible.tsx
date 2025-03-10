import { useRef } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function useToggleVisible({
  defaultVisible,
  toggleElementHeight = 40,
}: {
  defaultVisible?: boolean;
  toggleElementHeight?: number;
} = {}) {
  const visible = useRef(defaultVisible || false);
  const rotation = useSharedValue(defaultVisible ? 180 : 0); // Rotation value for the icon
  const height = useSharedValue(defaultVisible ? toggleElementHeight : 0); // Height value for the toggle content

  const toggleVisible = () => {
    // Rotate the icon between 0 and 180 degrees
    rotation.value = withTiming(visible.current ? 0 : 180, { duration: 250 });
    // Animate the height between 0 and 40
    height.value = withTiming(visible.current ? 0 : toggleElementHeight, {
      duration: 250,
    });
    visible.current = !visible.current;
  };

  // Animated styles for the icon's rotation
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Animated styles for the toggle element's height
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [0, toggleElementHeight], [0, 1]),
  }));

  return {
    contentAnimatedStyle,
    iconAnimatedStyle,
    toggleVisible,
  };
}
