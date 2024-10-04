import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { forwardRef } from 'react';
import { View } from 'react-native';

import { Calculator } from '@/components/tools/calculator';
import { Numpad } from '@/components/tools/numpad';
import { CalculatorIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { SheetBackdrop } from '../sheet-backdrop';

type Props = {
  renderView: 'calc' | 'numpad';
  renderViewNumpad: () => void;
  renderViewCalc: () => void;
  amount: number;
  setAmount: (val: number) => void;
};

const snapPoints = ['60%', '75%', '90%'];

const NumInputSheet = forwardRef<BottomSheetModalMethods | null, Props>(
  (props, ref) => {
    const { colors } = useThemeConfig();

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={SheetBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
        }}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        containerStyle={{ zIndex: 20 }}
        onDismiss={props.renderViewNumpad}
      >
        <BottomSheetView className="flex-1 pt-4">
          {props.renderView === 'calc' && (
            <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
              <CalculatorIcon className="text-foreground" size={24} />
              <Text className="text-lg">Kalkulator</Text>
            </View>
          )}

          {props.renderView === 'numpad' && (
            <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
              <Text className="font-bold">123</Text>
              <Text className="text-lg">Numpad</Text>
            </View>
          )}

          {props.renderView === 'numpad' && (
            <Numpad
              onPressCalc={props.renderViewCalc}
              amount={props.amount}
              onPressDone={props.setAmount}
            />
          )}

          {props.renderView === 'calc' && (
            <Calculator
              onPressNumpad={props.renderViewNumpad}
              amount={props.amount}
              onPressDone={props.setAmount}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default NumInputSheet;
