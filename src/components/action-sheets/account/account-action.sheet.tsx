import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { forwardRef, useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Account, useRemoveAccount } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { constructSearchParams } from '@/lib/utils';

type RenderView = 'menu' | 'remove-confirm';
type AccountActionSheetProps = Pick<Account, 'name' | 'id'>;

const RenderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    opacity={0.45}
    style={{
      backgroundColor: 'grey',
      position: 'absolute',
      top: 56, // header bar height
      left: 0,
      right: 0,
      bottom: 0,
    }}
  />
);

const AccountActionSheet = forwardRef<any, AccountActionSheetProps>(
  ({ name, id }, ref) => {
    const router = useRouter();
    const { colors } = useThemeConfig();
    const { dismiss } = useBottomSheetModal();
    const [renderView, setRenderView] = useState<RenderView>('menu');
    const { mutateAsync: removeAccount } = useRemoveAccount();

    const changeAccountHandler = () => {
      const sp = constructSearchParams({ id });
      dismiss();
      router.push(`/(account)/update${sp}`);
    };

    const changeAccountBalanceHandler = () => {
      const sp = constructSearchParams({ id });
      dismiss();
      router.push(`/(account)/update-balance${sp}`);
    };

    const removeAccountHandler = async () => {
      try {
        await removeAccount(id);
        dismiss();
      } catch (_error) {
        // todo
      }
    };

    const handleSheetChanges = useCallback((index: number) => {
      if (index < 0) setRenderView('menu');
    }, []);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['35%', '50%']}
        onChange={handleSheetChanges}
        backdropComponent={RenderBackdrop}
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
            <View className="mb-4 px-4">
              <Text className="text-lg font-bold">{name}</Text>
              <Text>Dibuat pada -</Text>
            </View>

            {renderView === 'menu' && (
              <View className="pb-6">
                <TouchableOpacity onPress={changeAccountHandler}>
                  <View className="h-14 flex-row items-center gap-4 border-b border-b-border px-4">
                    <PencilIcon size={20} className="text-foreground" />
                    <Text className="">Ubah akun</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={changeAccountBalanceHandler}>
                  <View className="h-14 flex-row items-center gap-4 border-b border-b-border px-4">
                    <PencilIcon size={20} className="text-foreground" />
                    <Text className="">Sesuaikan saldo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setRenderView('remove-confirm')}
                >
                  <View className="h-14 flex-row items-center gap-4 border-b border-b-border px-4">
                    <TrashIcon size={20} className="text-destructive" />
                    <Text className="text-destructive">Hapus akun</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {renderView === 'remove-confirm' && (
              <View className="px-4 pb-6 pt-2">
                <Text className="mb-1 text-xl font-semibold">Hapus akun?</Text>
                <Text className="mb-4">
                  Semua riwayat transaksi pada akun ini akan dihapus dan tidak
                  bisa dikembalikan!
                </Text>

                <View className="flex-row justify-end gap-2">
                  <Button
                    variant="destructive"
                    onPress={removeAccountHandler}
                    className="flex-1"
                  >
                    <Text>Hapus</Text>
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => setRenderView('menu')}
                    className="flex-1"
                  >
                    <Text>Batalkan</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default AccountActionSheet;
