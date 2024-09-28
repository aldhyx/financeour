import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, PlusIcon } from '@/components/ui';
import { AccountCard } from '@/components/ui/cards/account.card';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { ErrorScreen } from '@/components/ui/views/error-screen';
import {
  type Account,
  useAccounts,
  useUpdateAccount,
} from '@/db/actions/account';

// eslint-disable-next-line max-lines-per-function
const MyAccountScreen = () => {
  const router = useRouter();

  const { mutateAsync } = useUpdateAccount();
  const { data, error } = useAccounts();
  const isEmptyData = data.length === 0;

  const pressCardHandler = (id: string) => {
    router.push(`/(account)/${id}`);
  };

  const pressActionHandler = (_: Account) => {
    // SheetManager.show('account-action.sheet', {
    //   payload: account,
    // });
  };

  const pressFavoriteHandler = async (id: string, isFavorite: boolean) => {
    try {
      await mutateAsync({ id, values: { isFavorite } });
    } catch (_) {
      // TODO
    }
  };

  if (error) return <ErrorScreen />;

  return (
    <View className="flex-1 px-3">
      <Stack.Screen options={{ title: 'Akun saya' }} />

      <Button size="icon-lg" className="absolute bottom-10 right-6">
        <PlusIcon className="text-background" />
      </Button>

      <FlashList
        data={data}
        renderItem={({ item }) => (
          <AccountCard
            {...item}
            onPressCard={pressCardHandler}
            onPressAction={pressActionHandler}
            onPressFavorite={pressFavoriteHandler}
          />
        )}
        estimatedItemSize={data?.length || 1}
        contentContainerStyle={{
          paddingTop: isEmptyData ? 8 : 16,
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
  );
};

export default MyAccountScreen;
