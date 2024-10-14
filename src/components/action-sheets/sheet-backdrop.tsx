import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SheetBackdrop = (props: any) => {
  const { top } = useSafeAreaInsets();
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      opacity={0.5}
      style={{
        backgroundColor: 'black',
        position: 'absolute',
        top: 56 + top, // header bar height
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
};

export const HandleComponent = () => {
  return (
    <View className="mb-1 items-center justify-center py-2">
      <View className="h-1 w-8 rounded-full bg-foreground/10 " />
    </View>
  );
};

export const LineSeparator = () => (
  <View className="h-px w-full bg-border dark:bg-foreground/10" />
);
