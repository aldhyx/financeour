import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { View } from 'react-native';

import { SheetBackdrop } from '@/components/action-sheets/sheet-backdrop';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form/radio-group';
import { CheckIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DEFAULT_ACCOUNT_TYPES } from '@/constants/app';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { accountType?: string };
type SheetReturnData = { accountType: string } | undefined;
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

const useAccountTypeSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useAccountTypeSheetContext must be used within AccountTypeSheetProvider'
    );

  return context;
};

const AccountTypeSheetProvider = (props: PropsWithChildren) => {
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

const AccountTypeSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, _closedCbRef } = useAccountTypeSheetContext();
  const { colors } = useThemeConfig();

  const pressRadioHandler = (accountType: string) => {
    sheetReturnRef.current = { accountType };
    sheetRef.current?.close();
  };

  const dismissHandler = () => {
    if (_closedCbRef.current) {
      _closedCbRef.current(sheetReturnRef.current);
      // reset the state back to undefined
      sheetReturnRef.current = undefined;
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={SheetBackdrop}
      onDismiss={dismissHandler}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
      }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      containerStyle={{ zIndex: 20 }}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;
        return (
          <BottomSheetView>
            <View className="pb-4">
              <View className="mb-2 flex-row items-center justify-start gap-2 px-4">
                <WalletIcon className="text-foreground" size={24} />
                <Text className="text-lg">Pilih tipe akun</Text>
              </View>

              <RadioGroup value={sheetData.accountType}>
                {DEFAULT_ACCOUNT_TYPES.map((item) => (
                  <RadioGroupItem
                    key={item}
                    value={item}
                    onPress={pressRadioHandler}
                  >
                    <Text className="shrink capitalize">{item}</Text>

                    <RadioGroupIndicator>
                      <CheckIcon size={24} className="text-foreground" />
                    </RadioGroupIndicator>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export {
  AccountTypeSheet,
  AccountTypeSheetProvider,
  useAccountTypeSheetContext,
};
