import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, useRef } from 'react';
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
import { Text } from '@/components/ui/text';
import { ACCOUNT_TYPES } from '@/constants/app';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { createSheetContext } from '../sheet-context';

type SheetData = { accountType?: string };
type SheetReturnData = { accountType: string } | undefined;

const {
  useSheetContext: useAccountTypeListSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, SheetReturnData>();

const AccountTypeListSheetProvider = ({ children }: PropsWithChildren) => {
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
          <Text className="border-b border-b-secondary pb-3 text-center text-sm font-semibold">
            Select account type
          </Text>

          <RadioGroup value={sheetData?.accountType}>
            {ACCOUNT_TYPES.map((item) => (
              <RadioGroupItem
                key={item.label}
                value={item.label}
                onPress={pressRadioHandler}
              >
                <View className="flex-row items-center gap-4">
                  <item.icon size={20} className="text-foreground" />
                  <Text className="shrink pr-2 font-semibold capitalize">
                    {item.label}
                  </Text>
                </View>
                <RadioGroupIndicator />
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AccountTypeListSheetProvider, useAccountTypeListSheetContext };
