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

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
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
  showSheetAsync: (data: SheetData) => Promise<SheetReturnData>;
};

type SheetInternalContext = {
  /**
   * DO_NOT_USE_OUTSIDE!
   * ONLY_USE_INTERNALLY
   */
  closedCbRef: MutableRefObject<ClosedCbHandler | null>;
  sheetRef: MutableRefObject<BottomSheetModal | null>;
};

const sheetContext = createContext<SheetContext | null>(null);
const internalSheetContext = createContext<SheetInternalContext | null>(null);

const useAccountTypeSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context) {
    throw new Error(
      'useAccountTypeSheetContext must be used within AccountTypeSheetProvider'
    );
  }
  return context;
};

const useInternalSheetContext = () => {
  const context = useContext(internalSheetContext);
  if (!context) {
    throw new Error(
      'useInternalSheetContext must be used within AccountTypeSheetProvider'
    );
  }
  return context;
};

const AccountTypeSheetProvider = (props: PropsWithChildren) => {
  const sheetRef = useRef<BottomSheetModal | null>(null);
  const closedCbRef = useRef<ClosedCbHandler | null>(null);

  const showSheetAsync: SheetContext['showSheetAsync'] = useCallback(
    async (data) =>
      new Promise((resolve) => {
        sheetRef.current?.present(data);

        const closeCbHandler: ClosedCbHandler = (v) => resolve(v);
        closedCbRef.current = closeCbHandler;
      }),
    []
  );

  return (
    <internalSheetContext.Provider
      value={{ closedCbRef: closedCbRef, sheetRef }}
    >
      <sheetContext.Provider value={{ showSheetAsync }}>
        <AccountTypeSheet />
        {props.children}
      </sheetContext.Provider>
    </internalSheetContext.Provider>
  );
};

const AccountTypeSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, closedCbRef } = useInternalSheetContext();
  const { colors } = useThemeConfig();

  const pressRadioHandler = (accountType: string) => {
    sheetReturnRef.current = { accountType };
    sheetRef.current?.close();
  };

  const dismissHandler = () => {
    if (closedCbRef.current) {
      closedCbRef.current(sheetReturnRef.current);
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
      handleComponent={HandleComponent}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      containerStyle={{ zIndex: 20 }}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;
        return (
          <BottomSheetView>
            <View className="pb-3">
              <View className="mb-3 flex-row items-center justify-start gap-2 px-4">
                <WalletIcon className="text-foreground" size={20} />
                <Text>Pilih tipe akun</Text>
              </View>

              <View className="gap-1 px-4">
                <RadioGroup value={sheetData.accountType}>
                  {DEFAULT_ACCOUNT_TYPES.map((item) => (
                    <RadioGroupItem
                      key={item}
                      value={item}
                      onPress={pressRadioHandler}
                      className="rounded-2xl bg-secondary px-4"
                    >
                      <Text className="shrink font-medium capitalize">
                        {item}
                      </Text>

                      <RadioGroupIndicator>
                        <CheckIcon size={20} className="text-foreground" />
                      </RadioGroupIndicator>
                    </RadioGroupItem>
                  ))}
                </RadioGroup>
              </View>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export { AccountTypeSheetProvider, useAccountTypeSheetContext };
