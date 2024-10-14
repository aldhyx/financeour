import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import {
  AccountActionSheetProvider,
  useAccountActionSheetContext,
} from '@/components/action-sheets/account/account-action.sheet';
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

export default function MyAccountScreen() {
  const { data, error, isLoading } = useAccounts();

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <ErrorScreen />;

  if (data.length === 0) {
    return (
      <View className="px-4 pt-2">
        <AlertCard
          title="Belum ada akun."
          subTitle="Tambahkan akun pertama kamu untuk mulai kelola finansial bersama financeour."
        />
      </View>
    );
  }
  return (
    <AccountActionSheetProvider>
      <MyAccountList data={data} />
    </AccountActionSheetProvider>
  );
}

const MyAccountList = ({ data }: { data: Account[] }) => {
  const { showSheet: showActionSheet } = useAccountActionSheetContext();
  const { mutateAsync } = useUpdateAccount();

  const actionHandler = (account: Account) => {
    showActionSheet({
      id: account.id,
      name: account.name,
    });
  };

  const toggleFavoriteHandler = async (id: string, isFavorite: boolean) => {
    try {
      await mutateAsync({ id, values: { isFavorite } });
    } catch (_) {
      // TODO
    }
  };

  return (
    <View className="flex-1 px-4">
      <Link push asChild href="/(account)/create">
        <Button size="icon-lg" className="absolute bottom-10 right-6 z-10">
          <PlusIcon size={24} className="text-background" />
        </Button>
      </Link>

      <FlashList
        data={data}
        renderItem={({ item }) => (
          <AccountCard
            {...item}
            onPressAction={actionHandler}
            onPressFavorite={toggleFavoriteHandler}
          />
        )}
        estimatedItemSize={data?.length || 1}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 120,
        }}
        ItemSeparatorComponent={() => <View className="h-1" />}
      />
    </View>
  );
};
