import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import AccountActionSheet from '@/components/action-sheets/account/account-action.sheet';
import { Button } from '@/components/ui/button';
import { AccountCard } from '@/components/ui/cards/account.card';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { PlusIcon } from '@/components/ui/icon';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import {
  type Account,
  useAccounts,
  useUpdateAccount,
} from '@/db/actions/account';

type SelectedAccount = Pick<Account, 'id' | 'name'>;
const defaultAccount: SelectedAccount = { id: '', name: '' };

const MyAccountScreen = () => {
  const router = useRouter();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<SelectedAccount>(defaultAccount);
  const { data, error } = useAccounts();
  const { mutateAsync } = useUpdateAccount();

  const addAccountHandler = () => router.push('/(account)/create');

  const actionHandler = (account: Account) => {
    setSelectedAccount(account);
    sheetRef.current?.present('test');
  };

  const detailAccountHandler = (id: string) => {
    router.push(`/(account)/${id}`);
  };

  const toggleFavoriteHandler = async (id: string, isFavorite: boolean) => {
    try {
      await mutateAsync({ id, values: { isFavorite } });
    } catch (_) {
      // TODO
    }
  };

  if (error) return <ErrorScreen />;

  return (
    <BottomSheetModalProvider>
      <AccountActionSheet
        name={selectedAccount.name}
        id={selectedAccount.id}
        ref={sheetRef}
      />

      <View className="flex-1 px-4 pt-2">
        <Button
          size="icon-lg"
          className="absolute bottom-10 right-6 z-10"
          onPress={addAccountHandler}
        >
          <PlusIcon className="text-background" />
        </Button>

        <FlashList
          data={data}
          renderItem={({ item }) => (
            <AccountCard
              {...item}
              onPressCard={detailAccountHandler}
              onPressAction={actionHandler}
              onPressFavorite={toggleFavoriteHandler}
            />
          )}
          estimatedItemSize={data?.length || 1}
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          ListEmptyComponent={
            <AlertCard
              title="Belum ada akun."
              subTitle="Tambahkan akun pertama kamu untuk mulai kelola finansial bersama financeour."
            />
          }
        />
      </View>
    </BottomSheetModalProvider>
  );
};

export default MyAccountScreen;
