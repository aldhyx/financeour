import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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
import { useAccounts } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { accountId?: string; accountName?: string };
type SheetReturnData = { accountId: string; accountName: string } | undefined;
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

const useAccountSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useAccountSheetContext must be used within AccountSheetProvider'
    );

  return context;
};

const useInternalSheetContext = () => {
  const context = useContext(internalSheetContext);
  if (!context) {
    throw new Error(
      'useInternalSheetContext must be used within AccountSheetProvider'
    );
  }
  return context;
};

const AccountSheetProvider = (props: PropsWithChildren) => {
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
        <AccountSheet />
        {props.children}
      </sheetContext.Provider>
    </internalSheetContext.Provider>
  );
};

const AccountSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, closedCbRef } = useInternalSheetContext();
  const { colors, dark } = useThemeConfig();
  const { data } = useAccounts();
  const { height } = useWindowDimensions();

  const pressRadioHandler = (accountId: string, accountName: string) => {
    sheetReturnRef.current = { accountId, accountName };
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
      backdropComponent={SheetBackdrop}
      onDismiss={dismissHandler}
      handleComponent={HandleComponent}
      maxDynamicContentSize={height / 1.5}
      backgroundStyle={{
        backgroundColor: dark ? colors.background : colors.secondary,
      }}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;
        return (
          <BottomSheetView className="flex-1">
            <View className="pb-4">
              <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
                <WalletIcon className="text-foreground" size={20} />
                <Text>Pilih akun</Text>
              </View>

              <ScrollView>
                <View className="gap-1 px-4">
                  <RadioGroup value={sheetData.accountId}>
                    {data.map((item) => (
                      <RadioGroupItem
                        key={item.id}
                        value={item.id}
                        onPress={() => pressRadioHandler(item.id, item.name)}
                        className="rounded-2xl bg-background p-4 dark:bg-foreground/5"
                      >
                        <View>
                          <Text className="capita shrink font-semibold">
                            {item.name}
                          </Text>
                          <Text className="shrink text-sm capitalize">
                            {item.type}
                          </Text>
                        </View>

                        <RadioGroupIndicator>
                          <CheckIcon size={24} className="text-foreground" />
                        </RadioGroupIndicator>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  {/* Trick to show some item that hidden when scroll down */}
                  <View className="h-12" />
                </View>
              </ScrollView>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export { AccountSheetProvider, useAccountSheetContext };
