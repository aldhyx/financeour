import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

import { Calculator } from '@/components/tools/calculator';
import { Numpad } from '@/components/tools/numpad';
import { CalculatorIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { SheetBackdrop } from '../sheet-backdrop';

type SheetData = { value?: number };
type SheetReturnData = { value: number } | undefined;
type ClosedCbHandler = (val?: SheetReturnData) => void;

type SheetContext = {
  /**
   * DO_NOT_USE_OUTSIDE!
   * ONLY_USE_INTERNALLY_TO_STORE_CALLBACK_REF
   */
  _closedCbRef: MutableRefObject<ClosedCbHandler | null>;
  sheetRef: MutableRefObject<BottomSheetModal | null>;
  /**
   * Use this to open & await for the return value when the sheet got demised
   */
  sheetPresentAsync: (data: SheetData) => Promise<SheetReturnData>;
};

const sheetContext = createContext<SheetContext | null>(null);

const useNumInputSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useNumInputSheetContext must be used within NumInputSheetProvider'
    );

  return context;
};

const NumInputSheetProvider = (props: PropsWithChildren) => {
  const sheetRef = useRef<BottomSheetModal | null>(null);
  const closedCbRef = useRef<ClosedCbHandler | null>(null);

  const sheetPresentAsync: SheetContext['sheetPresentAsync'] = useCallback(
    async (data) =>
      new Promise((resolve) => {
        sheetRef.current?.present(data);

        const closeCbHandler: ClosedCbHandler = (v) => resolve(v);
        closedCbRef.current = closeCbHandler;
      }),
    []
  );

  return (
    <sheetContext.Provider
      value={{ sheetRef, sheetPresentAsync, _closedCbRef: closedCbRef }}
    >
      {props.children}
    </sheetContext.Provider>
  );
};

const NumInputSheet = () => {
  const [renderView, setRenderView] = useState<'numpad' | 'calc'>('numpad');
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, _closedCbRef } = useNumInputSheetContext();

  const { colors } = useThemeConfig();

  const dismissHandler = () => {
    setRenderView('numpad');
    if (_closedCbRef.current) {
      _closedCbRef.current(sheetReturnRef.current);
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
      handleIndicatorStyle={{
        backgroundColor: colors.border,
      }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      onDismiss={dismissHandler}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;

        return (
          <BottomSheetView>
            <View className="py-4">
              {renderView === 'calc' && (
                <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
                  <CalculatorIcon className="text-foreground" size={24} />
                  <Text className="text-lg">Kalkulator</Text>
                </View>
              )}

              {renderView === 'numpad' && (
                <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
                  <Text className="font-bold">123</Text>
                  <Text className="text-lg">Numpad</Text>
                </View>
              )}

              {renderView === 'numpad' && (
                <Numpad
                  onPressCalc={() => {
                    setRenderView('calc');
                  }}
                  value={sheetData.value}
                  onPressDone={pressDoneHandler}
                />
              )}

              {renderView === 'calc' && (
                <Calculator
                  onPressNumpad={() => {
                    setRenderView('numpad');
                  }}
                  value={sheetData.value}
                  onPressDone={pressDoneHandler}
                />
              )}
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export { NumInputSheet, NumInputSheetProvider, useNumInputSheetContext };
