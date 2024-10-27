import { Env } from '@env';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppLanguageSheetContext } from '@/components/action-sheets/setting/app-language.sheet';
import { useAppThemeSheetContext } from '@/components/action-sheets/setting/app-theme.sheet';
import { HeaderBar } from '@/components/ui/header-bar';
import { LanguagesIcon, PaletteIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSelectedLanguage } from '@/hooks/use-selected-language';
import { useSelectedTheme } from '@/hooks/use-selected-theme';

export default function SettingsScreen() {
  const { _ } = useLingui();

  return (
    <View className="flex-1 px-4">
      <Stack.Screen
        options={{
          title: _(msg`Profile`),
          header({ options }) {
            return <HeaderBar title={options.title} />;
          },
        }}
      />

      <View className="gap-2 pt-2">
        <LanguageSetting />
        <ThemeSetting />
      </View>

      <Text className="py-6 text-center text-muted-foreground">
        {Env.NAME} App - v{Env.VERSION}
      </Text>
    </View>
  );
}

const ThemeSetting = () => {
  const { showSheet } = useAppThemeSheetContext();
  const { selectedTheme } = useSelectedTheme();

  return (
    <Pressable className="active:opacity-50" onPress={showSheet}>
      <View className="flex-row items-center gap-3 rounded-2xl bg-secondary p-4">
        <PaletteIcon size={24} className="text-foreground" />
        <View className="shrink">
          <Text className="font-semibold">
            <Trans>Theme</Trans>
          </Text>
          <Text className="text-sm text-muted-foreground">
            {selectedTheme.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const LanguageSetting = () => {
  const { showSheet } = useAppLanguageSheetContext();
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Pressable className="active:opacity-50" onPress={showSheet}>
      <View className="flex-row items-center gap-3 rounded-2xl bg-secondary p-4">
        <LanguagesIcon size={24} className="text-foreground" />
        <View className="shrink">
          <Text className="font-semibold">
            <Trans>Language</Trans>
          </Text>
          <Text className="text-sm text-muted-foreground">
            {selectedLanguage.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
