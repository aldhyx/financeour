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
import { Text } from '@/components/ui/text';
import { ACCOUNT_TYPE_ICONS } from '@/constants/app';
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
          <Text className="border-b border-b-secondary pb-3 text-center text-sm font-semibold">
            Choose account
          </Text>

          <ScrollView>
            <RadioGroup value={sheetData?.accountId}>
              {data.map((item) => {
                const Icon =
                  ACCOUNT_TYPE_ICONS[item.type] ?? ACCOUNT_TYPE_ICONS.unknown;

                return (
                  <RadioGroupItem
                    key={item.id}
                    value={item.id}
                    onPress={() => pressRadioHandler(item.id, item.name)}
                  >
                    <View className="flex-row items-center justify-center gap-4">
                      <Icon className="text-foreground" size={20} />

                      <View>
                        <Text className="text-xs capitalize leading-tight text-muted-foreground">
                          {item.type}
                        </Text>
                        <Text className="shrink pr-2 font-semibold capitalize">
                          {item.name}
                        </Text>
                      </View>
                    </View>

                    <RadioGroupIndicator />
                  </RadioGroupItem>
                );
              })}
            </RadioGroup>
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AccountSheetProvider, useAccountSheetContext };
