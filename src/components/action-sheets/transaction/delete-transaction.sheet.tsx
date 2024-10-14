import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { Pressable, View } from 'react-native';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { Text } from '@/components/ui/text';
import { useRemoveTransaction } from '@/db/actions/transaction';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { id: string };

type SheetContext = {
  showSheet: (data: SheetData) => void;
};

type SheetInternalContext = {
  sheetRef: MutableRefObject<BottomSheetModal | null>;
};

const sheetContext = createContext<SheetContext | null>(null);
const internalSheetContext = createContext<SheetInternalContext | null>(null);

const useDeleteTransactionSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useDeleteTransactionSheetContext must be used within DeleteTransactionSheetProvider'
    );

  return context;
};

const useInternalSheetContext = () => {
  const context = useContext(internalSheetContext);
  if (!context) {
    throw new Error(
      'useInternalSheetContext must be used within DeleteTransactionSheetProvider'
    );
  }
  return context;
};

const DeleteTransactionSheetProvider = (props: PropsWithChildren) => {
  const sheetRef = useRef<BottomSheetModal | null>(null);

  const showSheet: SheetContext['showSheet'] = useCallback((data) => {
    sheetRef.current?.present(data);
  }, []);

  return (
    <internalSheetContext.Provider value={{ sheetRef }}>
      <sheetContext.Provider value={{ showSheet }}>
        <DeleteTransactionSheet />
        {props.children}
      </sheetContext.Provider>
    </internalSheetContext.Provider>
  );
};

const DeleteTransactionSheet = () => {
  const { sheetRef } = useInternalSheetContext();
  const { colors } = useThemeConfig();
  const { mutateAsync: removeTransaction } = useRemoveTransaction();

  const removeAccountHandler = (id: string) => async () => {
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
      {(_data) => {
        const sheetData = _data?.data as SheetData;

        return (
          <BottomSheetView>
            <View className="px-4 pb-4">
              <Text className="mb-1 font-semibold">Hapus transaksi?</Text>
              <Text className="mb-4">
                Data transaksi akan dihapus dan tidak bisa dikembalikan!
              </Text>

              <View className="gap-1">
                <Pressable
                  className="h-12 items-center justify-center rounded-2xl bg-secondary active:opacity-50"
                  onPress={removeAccountHandler(sheetData.id)}
                >
                  <Text className="font-medium text-red-500">Hapus</Text>
                </Pressable>

                <Pressable
                  className="h-12 items-center justify-center rounded-2xl bg-secondary active:opacity-50"
                  onPress={() => {
                    sheetRef.current?.dismiss();
                  }}
                >
                  <Text className="font-medium">Batalkan</Text>
                </Pressable>
              </View>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export { DeleteTransactionSheetProvider, useDeleteTransactionSheetContext };
