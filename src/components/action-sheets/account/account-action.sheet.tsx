import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { PropsWithChildren, useState } from 'react';
import { View } from 'react-native';

import {
  HandleComponent,
  SheetBackdrop,
} from '@/components/action-sheets/sheet-backdrop';
import { createSheetContext } from '@/components/action-sheets/sheet-context';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRemoveAccount } from '@/db/actions/account';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { constructSearchParams } from '@/lib/utils';

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
        <Text className="mb-4 text-center text-sm font-bold">
          {sheetData?.name}
        </Text>

        {renderView === 'menu' && (
          <View className="px-4 pb-4">
            <View className="gap-1">
              <Button
                variant="secondary"
                size="lg"
                className="flex-row items-center justify-start gap-4 px-4"
                onPress={changeAccountHandler(sheetData?.id)}
              >
                <PencilIcon size={20} className="text-foreground" />
                <Text>Edit account</Text>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="flex-row items-center justify-start gap-4 px-4"
                onPress={changeAccountBalanceHandler(sheetData?.id)}
              >
                <PencilIcon size={20} className="text-foreground" />
                <Text>Adjust balance</Text>
              </Button>

              <Button
                variant="secondary-destructive"
                size="lg"
                className="flex-row items-center justify-start gap-4 px-4"
                onPress={() => setRenderView('remove-confirm')}
              >
                <TrashIcon size={20} className="text-red-600" />
                <Text>Delete account</Text>
              </Button>
            </View>
          </View>
        )}

        {renderView === 'remove-confirm' && (
          <View className="px-4 pb-4">
            <Text className="mb-2 text-xl font-bold">Delete account?</Text>
            <Text className="mb-1">
              All transaction history related to this account will be deleted
              permanently.
            </Text>
            <Text className="mb-3 text-red-600">
              This action cannot be undone.
            </Text>

            <View className="gap-1">
              <Button
                variant="secondary-destructive"
                size="lg"
                onPress={removeAccountHandler(sheetData?.id)}
              >
                <Text>Delete</Text>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onPress={() => setRenderView('menu')}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AccountActionSheetProvider, useAccountActionSheetContext };
