import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Trans } from '@lingui/macro';
import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { Button } from '@/components/ui/button';
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
          <Text className="mb-1 text-xl font-bold">
            <Trans>Delete transaction?</Trans>
          </Text>
          <Text className="mb-3 text-red-600">
            <Trans>This action cannot be undone.</Trans>
          </Text>

          <View className="gap-1">
            <Button
              variant="secondary-destructive"
              size="lg"
              onPress={removeAccountHandler(sheetData?.id)}
            >
              <Text>
                <Trans>Delete</Trans>
              </Text>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onPress={() => {
                sheetRef.current?.dismiss();
              }}
            >
              <Text>
                <Trans>Cancel</Trans>
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { DeleteTransactionSheetProvider, useDeleteTransactionSheetContext };
