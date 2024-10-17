import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { PropsWithChildren, useRef } from 'react';
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
import { CheckCircleIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DEFAULT_ACCOUNT_TYPES } from '@/constants/app';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { createSheetContext } from '../sheet-context';

type SheetData = { accountType?: string };
type SheetReturnData = { accountType: string } | undefined;

const {
  useSheetContext: useAccountTypeSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, SheetReturnData>();

const AccountTypeSheetProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <AccountTypeSheet />
        {children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const AccountTypeSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, closedCbRef, sheetData } = useInternalSheetContext();
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
      <BottomSheetView>
        <View className="pb-3">
          <View className="mb-3 flex-row items-center justify-start gap-2 px-4">
            <WalletIcon className="text-foreground" size={20} />
            <Text>Pilih tipe akun</Text>
          </View>

          <View className="gap-1">
            <RadioGroup value={sheetData?.accountType}>
              {DEFAULT_ACCOUNT_TYPES.map((item) => (
                <RadioGroupItem
                  key={item}
                  value={item}
                  onPress={pressRadioHandler}
                  className="border-b border-b-border"
                >
                  <Text className="shrink font-medium capitalize">{item}</Text>

                  <RadioGroupIndicator>
                    <CheckCircleIcon size={24} className="text-foreground" />
                  </RadioGroupIndicator>
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AccountTypeSheetProvider, useAccountTypeSheetContext };
