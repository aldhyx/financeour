import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
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
import { CheckCircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { APP_THEMES, useSelectedTheme } from '@/hooks/use-selected-theme';
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
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

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
          <Text className="mb-3 px-4">App theme</Text>

          <ScrollView>
            <RadioGroup value={selectedTheme.id}>
              {APP_THEMES.map(({ id, icon: Icon, label }) => (
                <RadioGroupItem
                  key={id}
                  value={id}
                  onPress={() => {
                    sheetRef.current?.close();
                    setSelectedTheme(id);
                  }}
                  className="border-b border-b-border"
                >
                  <View className="flex-row items-center gap-3">
                    <Icon size={20} className="text-foreground" />
                    <Text className="font-medium">{label}</Text>
                  </View>

                  <RadioGroupIndicator>
                    <CheckCircleIcon size={24} className="text-foreground" />
                  </RadioGroupIndicator>
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
