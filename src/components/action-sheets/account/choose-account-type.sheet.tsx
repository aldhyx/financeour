import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { View } from 'react-native';

import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/form/radio-group';
import { CheckIcon, WalletIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DEFAULT_ACCOUNT_TYPES } from '@/constants/app';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { SheetBackdrop } from '../sheet-backdrop';

type Props = {
  value: string;
  onPressRadio: (val: string) => void;
};
const ChooseAccountTypeSheet = forwardRef<any, Props>((props, ref) => {
  const { colors } = useThemeConfig();

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={['50%', '75%']}
      backdropComponent={SheetBackdrop}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
      }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      containerStyle={{ zIndex: 20 }}
    >
      <BottomSheetView className="flex-1">
        <View className="pb-6 pt-4">
          <View className="mb-4 flex-row items-center justify-start gap-2 px-4">
            <WalletIcon className="text-foreground" size={24} />
            <Text className="text-lg">Pilih tipe akun</Text>
          </View>

          <RadioGroup value={props.value}>
            {DEFAULT_ACCOUNT_TYPES.map((item) => (
              <RadioGroupItem
                key={item}
                value={item}
                onPress={props.onPressRadio}
              >
                <Text className="shrink capitalize">{item}</Text>

                <RadioGroupIndicator>
                  <CheckIcon size={24} className="text-foreground" />
                </RadioGroupIndicator>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ChooseAccountTypeSheet;
