import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Trans } from '@lingui/macro';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
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
import { Text } from '@/components/ui/text';
import { useSelectedTheme } from '@/hooks/use-selected-theme';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { createSheetContext } from '../sheet-context';

const {
  InternalSheetProvider,
  SheetProvider,
  useInternalSheetContext,
  useSheetContext: useAppThemeSheetContext,
} = createSheetContext();

const AppThemeSheetProvider = (props: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <AppThemeSheet />
        {props.children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const AppThemeSheet = () => {
  const { sheetRef } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const { selectedTheme, setSelectedTheme, appThemes } = useSelectedTheme();

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
            <Trans>Theme</Trans>
          </Text>
          <Text className="border-b border-b-secondary pb-3 pl-4 text-sm">
            <Trans>Select your preferred theme</Trans>
          </Text>

          <ScrollView>
            <RadioGroup value={selectedTheme.id}>
              {appThemes.map(({ id, icon: Icon, label }) => (
                <RadioGroupItem
                  key={id}
                  value={id}
                  onPress={() => {
                    sheetRef.current?.close();
                    setSelectedTheme(id);
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <Icon size={20} className="text-foreground" />
                    <Text className="font-semibold">{label}</Text>
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

export { AppThemeSheetProvider, useAppThemeSheetContext };
