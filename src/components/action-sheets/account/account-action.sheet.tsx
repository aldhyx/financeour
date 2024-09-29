import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import { PencilIcon, Text, TrashIcon } from '@/components/ui';
import { constructSearchParams } from '@/lib/utils';

import DeleteAccountForm from './delete-account.form';

type RenderView = 'menu' | 'remove-confirm' | 'change-balance';

// eslint-disable-next-line max-lines-per-function
const AccountActionSheet = (props: SheetProps<'account-action.sheet'>) => {
  const [renderView, setRenderView] = useState<RenderView>('menu');
  const router = useRouter();

  const pressCancel = () => {
    setTimeout(() => {
      setRenderView('menu');
    }, 250);
  };

  return (
    <ActionSheet gestureEnabled={true}>
      <View className="pb-6 pt-4">
        <View className="mb-4 px-3">
          <Text className="text-lg font-bold">{props.payload!.name}</Text>
          <Text className="text-sm">Dibuat pada 22 April 2024</Text>
        </View>

        {renderView === 'menu' && (
          <View className="pb-6">
            <TouchableOpacity
              onPress={async () => {
                await SheetManager.hide(props.sheetId);
                const searchParams = constructSearchParams({
                  id: props.payload?.id,
                  name: props.payload?.name,
                  description: props.payload?.description,
                  type: props.payload?.type,
                });

                router.push(`/(account)/update${searchParams}`);
              }}
            >
              <View className="h-14 flex-row items-center gap-3 border-b border-b-secondary px-3">
                <PencilIcon size={20} className="text-foreground" />
                <Text className="font-medium">Ubah akun</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View className="h-14 flex-row items-center gap-3 border-b border-b-secondary px-3">
                <PencilIcon size={20} className="text-foreground" />
                <Text className="font-medium">Sesuaikan saldo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRenderView('remove-confirm')}>
              <View className="h-14 flex-row items-center gap-3 border-b border-b-secondary px-3">
                <TrashIcon size={20} className="text-destructive" />
                <Text className="font-medium text-destructive">Hapus akun</Text>
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
