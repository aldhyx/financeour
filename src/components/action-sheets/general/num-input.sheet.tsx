import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Trans } from '@lingui/macro';
import { PropsWithChildren, useRef, useState } from 'react';
import { View } from 'react-native';

import { Calculator } from '@/components/tools/calculator';
import { Numpad } from '@/components/tools/numpad';
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
              <Text className="mb-3 text-center text-sm font-semibold">
                <Trans>Numpad</Trans>
              </Text>

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
              <Text className="mb-3 text-center text-sm font-semibold">
                <Trans>Calculator</Trans>
              </Text>
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
