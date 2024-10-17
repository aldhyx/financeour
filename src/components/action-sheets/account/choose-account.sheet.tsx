import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { createSheetContext } from '@/components/action-sheets/sheet-context';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form/radio-group';
import { CheckCircleIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAccounts } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { accountId?: string; accountName?: string };
type SheetReturnData = { accountId: string; accountName: string } | undefined;

const {
  useSheetContext: useAccountSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, SheetReturnData>();

const AccountSheetProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <AccountSheet />
        {children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const AccountSheet = () => {
  const sheetReturnRef = useRef<SheetReturnData>();
  const { sheetRef, closedCbRef, sheetData } = useInternalSheetContext();
  const { colors } = useThemeConfig();
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
        backgroundColor: colors.background,
      }}
    >
      <BottomSheetView className="flex-1">
        <View className="pb-4">
          <View className="mb-3 flex-row items-center justify-start gap-2 px-4">
            <WalletIcon className="text-foreground" size={20} />
            <Text>Pilih akun</Text>
          </View>

          <ScrollView>
            <View className="gap-1">
              <RadioGroup value={sheetData?.accountId}>
                {data.map((item) => (
                  <RadioGroupItem
                    key={item.id}
                    value={item.id}
                    onPress={() => pressRadioHandler(item.id, item.name)}
                    className="h-14 border-b border-b-border"
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
                      <CheckCircleIcon size={24} className="text-foreground" />
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
    </BottomSheetModal>
  );
};

export { AccountSheetProvider, useAccountSheetContext };
