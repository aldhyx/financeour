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
import { View } from 'react-native';

import { SheetBackdrop } from '@/components/action-sheets/sheet-backdrop';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRemoveTransaction } from '@/db/actions/transaction';
import { useThemeConfig } from '@/hooks/use-theme-config';

type SheetData = { id: string };

type SheetContext = {
  sheetRef: MutableRefObject<BottomSheetModal | null>;
  sheetPresent: (data: SheetData) => void;
};

const sheetContext = createContext<SheetContext | null>(null);

const useDeleteTransactionSheetContext = () => {
  const context = useContext(sheetContext);
  if (!context)
    throw new Error(
      'useDeleteTransactionSheetContext must be used within DeleteTransactionSheetProvider'
    );

  return context;
};

const DeleteTransactionSheetProvider = (props: PropsWithChildren) => {
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

const DeleteTransactionSheet = () => {
  const { sheetRef } = useDeleteTransactionSheetContext();
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

        return (
          <BottomSheetView>
            <View className="px-4 pb-4">
              <Text className="mb-1 text-lg font-semibold">
                Hapus transaksi?
              </Text>
              <Text className="mb-4">
                Data transaksi akan dihapus dan tidak bisa dikembalikan!
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
                  onPress={() => sheetRef.current?.dismiss()}
                  className="flex-1"
                >
                  <Text>Batalkan</Text>
                </Button>
              </View>
            </View>
          </BottomSheetView>
        );
      }}
    </BottomSheetModal>
  );
};

export {
  DeleteTransactionSheet,
  DeleteTransactionSheetProvider,
  useDeleteTransactionSheetContext,
};
