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
import { useAccounts } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { accountId?: string; accountName?: string };
type SheetReturnData = { accountId: string; accountName: string } | undefined;
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

const useAccountSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useAccountSheetContext must be used within AccountSheetProvider'
    );

  return context;
};

const AccountSheetProvider = (props: PropsWithChildren) => {
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
const snapPoints = ['50%', '75%'];

const AccountSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, _closedCbRef } = useAccountSheetContext();
  const { colors } = useThemeConfig();
  const { data } = useAccounts();

  const pressRadioHandler = (accountId: string, accountName: string) => {
    sheetReturnRef.current = { accountId, accountName };
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
      index={0}
      snapPoints={snapPoints}
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
          <BottomSheetView className="flex-1">
            <View className="pb-6 pt-4">
              <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
                <WalletIcon className="text-foreground" size={24} />
                <Text className="text-lg">Pilih akun</Text>
              </View>

              <RadioGroup value={sheetData.accountId}>
                {data.map((item) => (
                  <RadioGroupItem
                    key={item.id}
                    value={item.id}
                    onPress={() => pressRadioHandler(item.id, item.name)}
                    className="py-3"
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
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export { AccountSheet, AccountSheetProvider, useAccountSheetContext };
