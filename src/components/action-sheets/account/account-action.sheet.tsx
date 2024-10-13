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

type SheetData = { id: string; name: string };

type SheetContext = {
  showSheet: (data: SheetData) => void;
};

type SheetInternalContext = {
  sheetRef: MutableRefObject<BottomSheetModal | null>;
};

const sheetContext = createContext<SheetContext | null>(null);
const internalSheetContext = createContext<SheetInternalContext | null>(null);

const useAccountActionSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useAccountActionSheetContext must be used within AccountActionSheetProvider'
    );

  return context;
};

const useInternalSheetContext = () => {
  const context = useContext(internalSheetContext);
  if (!context) {
    throw new Error(
      'useInternalSheetContext must be used within AccountActionSheetProvider'
    );
  }
  return context;
};

const AccountActionSheetProvider = (props: PropsWithChildren) => {
  const sheetRef = useRef<BottomSheetModal | null>(null);

  const showSheet: SheetContext['showSheet'] = useCallback((data) => {
    sheetRef.current?.present(data);
  }, []);

  return (
    <internalSheetContext.Provider value={{ sheetRef }}>
      <sheetContext.Provider value={{ showSheet }}>
        <AccountActionSheet />
        {props.children}
      </sheetContext.Provider>
    </internalSheetContext.Provider>
  );
};

type RenderView = 'menu' | 'remove-confirm';
const AccountActionSheet = () => {
  const { sheetRef } = useInternalSheetContext();
  const { colors, dark } = useThemeConfig();
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
      handleComponent={HandleComponent}
      containerStyle={{ zIndex: 20 }}
      backgroundStyle={{
        backgroundColor: dark ? colors.background : colors.secondary,
      }}
    >
      {(_data) => {
        const sheetData = _data?.data as SheetData;

        return (
          <BottomSheetView>
            <View className="pb-4">
              {renderView === 'menu' && (
                <>
                  <View className="px-4 pb-3">
                    <Text>{sheetData.name}</Text>
                  </View>

                  <View className="mx-4 mb-2 rounded-2xl bg-background dark:bg-foreground/5">
                    <Pressable
                      className="active:opacity-50"
                      onPress={changeAccountHandler(sheetData.id)}
                    >
                      <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                        <Text className="font-semibold">Ubah akun</Text>
                        <PencilIcon size={20} className="text-foreground" />
                      </View>
                    </Pressable>

                    <LineSeparator />

                    <Pressable
                      className="active:opacity-50"
                      onPress={changeAccountBalanceHandler(sheetData.id)}
                    >
                      <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                        <Text className="font-semibold">Sesuaikan saldo</Text>
                        <PencilIcon size={20} className="text-foreground" />
                      </View>
                    </Pressable>
                  </View>

                  <View className="mx-4 rounded-2xl bg-background dark:bg-foreground/5">
                    <Pressable
                      className="active:opacity-50"
                      onPress={() => setRenderView('remove-confirm')}
                    >
                      <View className="h-14 flex-row items-center justify-between gap-4 px-4">
                        <Text className="font-semibold text-red-600">
                          Hapus akun
                        </Text>
                        <TrashIcon size={20} className="text-red-600" />
                      </View>
                    </Pressable>
                  </View>
                </>
              )}

              {renderView === 'remove-confirm' && (
                <View className="px-4">
                  <Text className="mb-1 font-semibold">Hapus akun?</Text>
                  <Text className="mb-4">
                    Semua riwayat transaksi pada akun ini akan dihapus dan tidak
                    bisa dikembalikan!
                  </Text>

                  <View className="gap-2">
                    <Pressable
                      className="h-12 items-center justify-center rounded-2xl bg-background active:opacity-50 dark:bg-foreground/5"
                      onPress={removeAccountHandler(sheetData.id)}
                    >
                      <Text className="font-medium text-red-500">Hapus</Text>
                    </Pressable>

                    <Pressable
                      className="h-12 items-center justify-center rounded-2xl bg-background active:opacity-50 dark:bg-foreground/5"
                      onPress={() => setRenderView('menu')}
                    >
                      <Text className="font-medium">Batalkan</Text>
                    </Pressable>
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

export { AccountActionSheetProvider, useAccountActionSheetContext };
