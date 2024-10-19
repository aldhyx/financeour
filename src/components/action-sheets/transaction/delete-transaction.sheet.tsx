import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { Text } from '@/components/ui/text';
import { useRemoveTransaction } from '@/db/actions/transaction';
import { useThemeConfig } from '@/hooks/use-theme-config';

import { createSheetContext } from '../sheet-context';

const {
  useSheetContext: useDeleteTransactionSheetContext,
  useInternalSheetContext,
  SheetProvider,
  InternalSheetProvider,
} = createSheetContext<{ id: string }, null>();

const DeleteTransactionSheetProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalSheetProvider>
      <SheetProvider>
        <DeleteTransactionSheet />
        {children}
      </SheetProvider>
    </InternalSheetProvider>
  );
};

const DeleteTransactionSheet = () => {
  const { sheetRef, sheetData } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const { mutateAsync: removeTransaction } = useRemoveTransaction();

  const removeAccountHandler = (id?: string) => async () => {
    if (!id) return;
    try {
      await removeTransaction(id);
      sheetRef.current?.forceClose();
      router.back();
    } catch (_error) {
      // todo
    }
  };

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
      containerStyle={{ zIndex: 20 }}
    >
      <BottomSheetView>
        <View className="px-4 pb-4">
          <Text className="mb-1 font-semibold">Hapus transaksi?</Text>
          <Text className="mb-4">
            Data transaksi akan dihapus dan tidak bisa dikembalikan!
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
              onPress={() => {
                sheetRef.current?.dismiss();
              }}
            >
              <Text className="font-medium">Batalkan</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { DeleteTransactionSheetProvider, useDeleteTransactionSheetContext };
