import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SheetBackdrop = (props: any) => {
  const { top } = useSafeAreaInsets();
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      opacity={0.45}
      style={{
        backgroundColor: 'grey',
        position: 'absolute',
        top: 56 + top, // header bar height
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
};
