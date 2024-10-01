import { View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { CheckIcon, Text, WalletIcon } from '@/components/ui';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form';
import { DEFAULT_ACCOUNT_TYPES } from '@/constants/app';
import { useThemeConfig } from '@/hooks/use-theme-config';

const pressRadioHandler = (accountType: string) => {
  SheetManager.hide('choose-account-type.sheet', {
    payload: { accountType },
  });
};

const ChooseAccountTypeSheet = (
  props: SheetProps<'choose-account-type.sheet'>
) => {
  const { colors } = useThemeConfig();

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={{ backgroundColor: colors.background }}
      overlayColor="grey"
      indicatorStyle={{
        backgroundColor: colors.border,
      }}
      isModal={false}
    >
      <View className="pb-6 pt-4">
        <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
          <WalletIcon className="text-foreground" size={24} />
          <Text className="text-lg">Pilih tipe akun</Text>
        </View>

        <RadioGroup value={props.payload?.accountType}>
          {DEFAULT_ACCOUNT_TYPES.map((item) => (
            <RadioGroupItem key={item} value={item} onPress={pressRadioHandler}>
              <Text className="shrink text-lg capitalize">{item}</Text>

              <RadioGroupIndicator>
                <CheckIcon size={24} className="text-foreground" />
              </RadioGroupIndicator>
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </View>
    </ActionSheet>
  );
};

export default ChooseAccountTypeSheet;
