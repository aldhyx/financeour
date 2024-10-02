import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { constructSearchParams } from '@/lib/utils';

import DeleteAccountForm from './delete-account.form';

type RenderView = 'menu' | 'remove-confirm' | 'change-balance';

// eslint-disable-next-line max-lines-per-function
const AccountActionSheet = (props: SheetProps<'account-action.sheet'>) => {
  const [renderView, setRenderView] = useState<RenderView>('menu');
  const router = useRouter();
  const { colors } = useThemeConfig();

  const pressCancel = () => {
    setTimeout(() => {
      setRenderView('menu');
    }, 250);
  };

  const pressChangeAccount = useCallback(async () => {
    console.log('pressed 1');
    await SheetManager.hide(props.sheetId);
    console.log('pressed 2');
    const searchParams = constructSearchParams({
      id: props.payload?.id,
      name: props.payload?.name,
      description: props.payload?.description,
      type: props.payload?.type,
    });

    router.push(`/(account)/update${searchParams}`);
  }, [props.payload, router, props.sheetId]);

  const pressChangeAccountBalance = useCallback(async () => {
    await SheetManager.hide(props.sheetId);
    const searchParams = constructSearchParams({
      id: props.payload?.id,
      balance: props.payload?.balance ? props.payload.balance.toString() : '',
    });

    router.push(`/(account)/update-balance${searchParams}`);
  }, [router, props.payload, props.sheetId]);

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
        <View className="mb-4 px-4">
          <Text className="text-lg font-bold">{props.payload!.name}</Text>
          <Text>Dibuat pada 22 April 2024</Text>
        </View>

        {renderView === 'menu' && (
          <View className="pb-6">
            <TouchableOpacity onPress={pressChangeAccount}>
              <View className="h-14 flex-row items-center gap-4 border-b border-b-input px-4">
                <PencilIcon size={20} className="text-foreground" />
                <Text className="text-lg font-medium">Ubah akun</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={pressChangeAccountBalance}>
              <View className="h-14 flex-row items-center gap-4 border-b border-b-input px-4">
                <PencilIcon size={20} className="text-foreground" />
                <Text className="text-lg font-medium">Sesuaikan saldo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRenderView('remove-confirm')}>
              <View className="h-14 flex-row items-center gap-4 border-b border-b-input px-4">
                <TrashIcon size={20} className="text-destructive" />
                <Text className="text-lg font-medium text-destructive">
                  Hapus akun
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {renderView === 'remove-confirm' && (
          <DeleteAccountForm
            onPressCancel={pressCancel}
            id={props.payload!.id}
            sheetId={props.sheetId}
          />
        )}
      </View>
    </ActionSheet>
  );
};

export default AccountActionSheet;
