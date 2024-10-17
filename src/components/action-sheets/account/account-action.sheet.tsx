import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { PropsWithChildren, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  HandleComponent,
  LineSeparator,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRemoveAccount } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { constructSearchParams } from '@/lib/utils';

import { createSheetContext } from '../sheet-context';

type SheetData = { id: string; name: string };
const {
  useSheetContext: useAccountActionSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<SheetData, null>();

const AccountActionSheetProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <AccountActionSheet />
        {children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

type RenderView = 'menu' | 'remove-confirm';
const AccountActionSheet = () => {
  const { sheetRef, sheetData } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const [renderView, setRenderView] = useState<RenderView>('menu');
  const { mutateAsync: removeAccount } = useRemoveAccount();

  const changeAccountHandler = (id?: string) => () => {
    if (!id) return;
    const sp = constructSearchParams({ id });
    sheetRef.current?.dismiss();
    router.push(`/(account)/update${sp}`);
  };

  const changeAccountBalanceHandler = (id?: string) => () => {
    if (!id) return;
    const sp = constructSearchParams({ id });
    sheetRef.current?.dismiss();
    router.push(`/(account)/update-balance${sp}`);
  };

  const removeAccountHandler = (id?: string) => async () => {
    if (!id) return;
    try {
      await removeAccount(id);
      sheetRef.current?.dismiss();
    } catch (_error) {
      // todo
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index < 0) setRenderView('menu');
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backdropComponent={SheetBackdrop}
      handleComponent={HandleComponent}
      containerStyle={{ zIndex: 20 }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
    >
      <BottomSheetView>
        {renderView === 'menu' && (
          <View className="px-4 pb-4">
            <Text className="mb-3 text-center">{sheetData?.name}</Text>

            <View className="mb-2 rounded-xl bg-secondary">
              <Pressable
                className="active:opacity-50"
                onPress={changeAccountHandler(sheetData?.id)}
              >
                <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                  <Text className="font-medium">Ubah akun</Text>
                  <PencilIcon size={20} className="text-foreground" />
                </View>
              </Pressable>

              <LineSeparator />

              <Pressable
                className="active:opacity-50"
                onPress={changeAccountBalanceHandler(sheetData?.id)}
              >
                <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                  <Text className="font-medium">Sesuaikan saldo</Text>
                  <PencilIcon size={20} className="text-foreground" />
                </View>
              </Pressable>
            </View>

            <View className="rounded-xl bg-secondary">
              <Pressable
                className="active:opacity-50"
                onPress={() => setRenderView('remove-confirm')}
              >
                <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                  <Text className="font-medium text-red-600">Hapus akun</Text>
                  <TrashIcon size={20} className="text-red-600" />
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {renderView === 'remove-confirm' && (
          <View className="px-4 pb-4">
            <Text className="mb-1 font-medium">Hapus akun?</Text>
            <Text className="mb-4">
              Semua riwayat transaksi pada akun ini akan dihapus dan tidak bisa
              dikembalikan!
            </Text>

            <View className="gap-1">
              <Pressable
                className="h-14 items-center justify-center rounded-xl bg-secondary active:opacity-50"
                onPress={removeAccountHandler(sheetData?.id)}
              >
                <Text className="font-medium text-red-500">Hapus</Text>
              </Pressable>

              <Pressable
                className="h-14 items-center justify-center rounded-xl bg-secondary active:opacity-50"
                onPress={() => setRenderView('menu')}
              >
                <Text className="font-medium">Batalkan</Text>
              </Pressable>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AccountActionSheetProvider, useAccountActionSheetContext };
