import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { PropsWithChildren, useRef, useState } from 'react';
import { View } from 'react-native';

import { Calculator } from '@/components/tools/calculator';
import { Numpad } from '@/components/tools/numpad';
import { CalculatorIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { HandleComponent, SheetBackdrop } from '../sheet-backdrop';
import { createSheetContext } from '../sheet-context';

type SheetData = { value?: number };
type SheetReturnData = { value: number } | undefined;

const {
  useSheetContext: useNumInputSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, SheetReturnData>();

const NumInputSheetProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <NumInputSheet />
        {children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const NumInputSheet = () => {
  const [renderView, setRenderView] = useState<'numpad' | 'calc'>('numpad');
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, closedCbRef, sheetData } = useInternalSheetContext();
  const { colors } = useThemeConfig();

  const dismissHandler = () => {
    setRenderView('numpad');
    if (closedCbRef.current) {
      closedCbRef.current(sheetReturnRef.current);
      // reset the state back to undefined
      sheetReturnRef.current = undefined;
    }
  };

  const pressDoneHandler = (value: number) => {
    sheetReturnRef.current = { value };
    sheetRef.current?.close();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={SheetBackdrop}
      handleComponent={HandleComponent}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      onDismiss={dismissHandler}
    >
      <BottomSheetView>
        <View className="pb-4">
          {renderView === 'numpad' && (
            <>
              <View className="mb-2 flex-row items-center justify-start gap-2 px-4">
                <Text className="font-bold">123</Text>
                <Text>Numpad</Text>
              </View>
              <Numpad
                onPressCalc={() => {
                  setRenderView('calc');
                }}
                value={sheetData?.value}
                onPressDone={pressDoneHandler}
              />
            </>
          )}

          {renderView === 'calc' && (
            <>
              <View className="mb-2 flex-row items-center justify-start gap-2 px-4">
                <CalculatorIcon className="text-foreground" size={20} />
                <Text>Kalkulator</Text>
              </View>
              <Calculator
                onPressNumpad={() => {
                  setRenderView('numpad');
                }}
                value={sheetData?.value}
                onPressDone={pressDoneHandler}
              />
            </>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { NumInputSheetProvider, useNumInputSheetContext };
