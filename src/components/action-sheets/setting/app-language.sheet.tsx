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
import { Text } from '@/components/ui/text';
import { useSelectedLanguage } from '@/hooks/use-selected-language';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { createSheetContext } from '../sheet-context';

const {
  InternalSheetProvider,
  SheetProvider,
  useInternalSheetContext,
  useSheetContext: useAppLanguageSheetContext,
} = createSheetContext();

const AppLanguageSheetProvider = (props: PropsWithChildren) => {
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
  const { sheetRef } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const { languages, selectedLanguage, setSelectedLanguage } =
    useSelectedLanguage();

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
          <Text className="border-b border-b-secondary pb-3 text-center text-sm font-bold">
            Select app language
          </Text>
          <ScrollView>
            <RadioGroup value={selectedLanguage.code}>
              {languages.map((language) => (
                <RadioGroupItem
                  key={language.code}
                  value={language.code}
                  onPress={() => {
                    sheetRef.current?.close();
                    setSelectedLanguage(language);
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-6">
                      <Text className="font-bold uppercase leading-tight">
                        {language.code}
                      </Text>
                    </View>
                    <Text className="font-semibold">{language.name}</Text>
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

export { AppLanguageSheetProvider, useAppLanguageSheetContext };
