import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { SheetBackdrop } from '@/components/action-sheets/sheet-backdrop';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRemoveAccount } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { dateToString } from '@/lib/dayjs';
import { constructSearchParams } from '@/lib/utils';

type SheetData = { id: string; name: string; createdAt: string };

type SheetContext = {
  sheetRef: MutableRefObject<BottomSheetModal | null>;
  sheetPresent: (data: SheetData) => void;
};

const sheetContext = createContext<SheetContext | null>(null);

const useAccountActionSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useAccountActionSheetContext must be used within AccountActionSheetProvider'
    );

  return context;
};

const AccountActionSheetProvider = (props: PropsWithChildren) => {
  const sheetRef = useRef<BottomSheetModal | null>(null);

  const sheetPresent: SheetContext['sheetPresent'] = useCallback((data) => {
    sheetRef.current?.present(data);
  }, []);

  return (
    <sheetContext.Provider value={{ sheetRef, sheetPresent }}>
      {props.children}
    </sheetContext.Provider>
  );
};

type RenderView = 'menu' | 'remove-confirm';
const AccountActionSheet = () => {
  const { sheetRef } = useAccountActionSheetContext();
  const { colors } = useThemeConfig();
  const [renderView, setRenderView] = useState<RenderView>('menu');
  const { mutateAsync: removeAccount } = useRemoveAccount();

  const changeAccountHandler = (id: string) => () => {
    const sp = constructSearchParams({ id });
    sheetRef.current?.dismiss();
    router.push(`/(account)/update${sp}`);
  };

  const changeAccountBalanceHandler = (id: string) => () => {
    const sp = constructSearchParams({ id });
    sheetRef.current?.dismiss();
    router.push(`/(account)/update-balance${sp}`);
  };

  const removeAccountHandler = (id: string) => async () => {
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
      handleIndicatorStyle={{
        backgroundColor: colors.border,
      }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      containerStyle={{ zIndex: 20 }}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;
        const createdAt = dateToString(
          new Date(sheetData.createdAt),
          'D/M/YYYY'
        );

        return (
          <BottomSheetView>
            <View className="pb-4">
              <View className="px-4 pb-3">
                <Text className="text-lg font-bold">{sheetData.name}</Text>
                <Text className="text-sm">Dibuat pada {createdAt}</Text>
              </View>

              {renderView === 'menu' && (
                <>
                  <TouchableOpacity
                    onPress={changeAccountHandler(sheetData.id)}
                  >
                    <View className="h-14 flex-row items-center gap-4 border-b border-b-border px-4">
                      <PencilIcon size={20} className="text-foreground" />
                      <Text className="">Ubah akun</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={changeAccountBalanceHandler(sheetData.id)}
                  >
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
                </>
              )}

              {renderView === 'remove-confirm' && (
                <View className="px-4">
                  <Text className="mb-1 text-lg font-semibold">
                    Hapus akun?
                  </Text>
                  <Text className="mb-4">
                    Semua riwayat transaksi pada akun ini akan dihapus dan tidak
                    bisa dikembalikan!
                  </Text>

                  <View className="flex-row justify-end gap-2">
                    <Button
                      variant="destructive"
                      onPress={removeAccountHandler(sheetData.id)}
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
        );
      }}
    </BottomSheetModal>
  );
};

export {
  AccountActionSheet,
  AccountActionSheetProvider,
  useAccountActionSheetContext,
};
