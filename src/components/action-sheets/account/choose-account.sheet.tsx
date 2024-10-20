import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  PropsWithChildren,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { createSheetContext } from '@/components/action-sheets/sheet-context';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { inputVariants } from '@/components/ui/form/input';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form/radio-group';
import { Text } from '@/components/ui/text';
import { ACCOUNT_TYPE_ICONS } from '@/constants/app';
import { useAccounts } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { cn } from '@/lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const pressRadioHandler = (accountId: string, accountName: string) => {
    sheetReturnRef.current = { accountId, accountName };
    sheetRef.current?.close();
  };

  const dismissHandler = () => {
    if (closedCbRef.current) {
      closedCbRef.current(sheetReturnRef.current);
      // reset the state back to undefined
      sheetReturnRef.current = undefined;
      // reset the
      setSearchQuery('');
    }
  };

  const filteredData = useMemo(() => {
    const value = deferredSearchQuery.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.type.toLowerCase().includes(value.toLowerCase())
    );
  }, [deferredSearchQuery, data]);

  const hasData = data.length > 0;
  const hasFilteredData = filteredData.length > 0;

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={SheetBackdrop}
      onDismiss={dismissHandler}
      handleComponent={HandleComponent}
      index={0}
      snapPoints={['50%', '80%']}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      // this help prevent app from crash when keyboard show up & try to dismiss the sheet by using gesture (pan down)
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView className="flex-1">
        <View className="pb-4">
          <Text className="mb-3 text-center text-sm font-semibold">
            Choose account
          </Text>

          {!hasData && (
            <View className="p-4">
              <AlertCard
                title="No account found"
                subTitle="Create your first account & start manage your finance now."
              />
            </View>
          )}

          {hasData && (
            <View className="mb-3 px-4">
              <BottomSheetTextInput
                className={cn(inputVariants({ size: 'sm' }))}
                placeholder="Search account..."
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {hasData && !hasFilteredData && (
            <View>
              <Text className="text-center text-muted-foreground">
                No account found.
              </Text>
            </View>
          )}

          <ScrollView>
            <RadioGroup value={sheetData?.accountId}>
              {filteredData.map((item) => {
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
