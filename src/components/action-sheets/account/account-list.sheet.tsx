import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
import { getAccountTypeIcon } from '@/constants/account-types';
import { useAccounts } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { cn } from '@/lib/utils';

type SheetData = { accountId?: string; accountName?: string };
type SheetReturnData = { accountId: string; accountName: string } | undefined;

const {
  useSheetContext: useAccountListSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, SheetReturnData>();

const AccountListSheetProvider = ({ children }: PropsWithChildren) => {
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
  const { _ } = useLingui();
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
            <Trans>Select an account</Trans>
          </Text>

          {!hasData && (
            <View className="p-4">
              <AlertCard
                title={_(msg`No account found`)}
                subTitle={_(
                  msg`Create your first account & start manage your finance now.`
                )}
              />
            </View>
          )}

          {hasData && (
            <View className="mb-3 px-4">
              <BottomSheetTextInput
                className={cn(inputVariants({ size: 'sm' }))}
                placeholder={_(msg`Search account...`)}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {hasData && !hasFilteredData && (
            <View>
              <Text className="text-center text-muted-foreground">
                <Trans>No account found.</Trans>
              </Text>
            </View>
          )}

          <ScrollView>
            <RadioGroup value={sheetData?.accountId}>
              {filteredData.map((item) => {
                const Icon = getAccountTypeIcon(item.type);

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

export { AccountListSheetProvider, useAccountListSheetContext };
