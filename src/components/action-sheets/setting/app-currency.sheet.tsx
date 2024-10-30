import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { useCurrencyContext } from '@/components/contexts/currency.context';
import { inputVariants } from '@/components/ui/form/input';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form/radio-group';
import { Text } from '@/components/ui/text';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { cn } from '@/lib/utils';

import { createSheetContext } from '../sheet-context';

const {
  InternalSheetProvider,
  SheetProvider,
  useInternalSheetContext,
  useSheetContext: useAppCurrencySheetContext,
} = createSheetContext();

const AppCurrencySheetProvider = (props: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <AppLanguageSheet />
        {props.children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const AppLanguageSheet = () => {
  const { _ } = useLingui();
  const { sheetRef } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const { currencyList, setSelectedCurrency, selectedCurrency } =
    useCurrencyContext();

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={SheetBackdrop}
      handleComponent={HandleComponent}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
    >
      <BottomSheetView className="flex-1">
        <View className="pb-4">
          <Text className="pl-4 font-bold">
            <Trans>Currency</Trans>
          </Text>
          <Text className="mb-3 pl-4 text-sm">
            <Trans>Select your preferred currency</Trans>
          </Text>

          <View className="mb-3 px-4">
            <BottomSheetTextInput
              className={cn(inputVariants({ size: 'sm' }))}
              placeholder={_(msg`Search currency...`)}
            />
          </View>

          <ScrollView>
            <RadioGroup value={selectedCurrency.languageTag}>
              {currencyList.map((currency) => (
                <RadioGroupItem
                  key={currency.languageTag}
                  value={currency.languageTag}
                  onPress={() => {
                    sheetRef.current?.close();
                    setSelectedCurrency(currency.languageTag);
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="size-9 items-center justify-center rounded-xl bg-secondary">
                      <Text className="text-center font-bold">
                        {currency.currencySymbol}
                      </Text>
                    </View>

                    <View>
                      <Text className="font-semibold leading-tight">
                        {currency.currencyCode}
                      </Text>
                      <Text className="text-sm leading-tight">
                        {currency.currencyName}
                      </Text>
                    </View>
                  </View>

                  <RadioGroupIndicator />
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AppCurrencySheetProvider, useAppCurrencySheetContext };
