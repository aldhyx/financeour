import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, PlusIcon } from '@/components/ui';
import { AccountCard } from '@/components/ui/cards/account.card';
import { AlertCard } from '@/components/ui/cards/alert.card';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import {
  type Account,
  useAccounts,
  useUpdateAccount,
} from '@/db/actions/account';

const MyAccountScreen = () => {
  const router = useRouter();

  const { mutateAsync } = useUpdateAccount();
  const { data, error } = useAccounts();
  const isEmptyData = data.length === 0;

  const pressAddAccountHandler = async () => {
    router.push('/(account)/create');
  };

  const pressActionHandler = (_: Account) => {};

  const pressToggleFavoriteHandler = async (
    id: string,
    isFavorite: boolean
  ) => {
    try {
      await mutateAsync({ id, values: { isFavorite } });
    } catch (_) {
      // TODO
    }
  };

  if (error) return <ErrorScreen />;

  return (
    <View className="flex-1 px-3">
      <Button
        size="icon-lg"
        className="absolute bottom-10 right-6 z-10"
        onPress={pressAddAccountHandler}
      >
        <PlusIcon className="text-background" />
      </Button>

      <FlashList
        data={data}
        renderItem={({ item }) => (
          <AccountCard
            {...item}
            onPressCard={() => router.push(`/(account)/${item.id}`)}
            onPressAction={pressActionHandler}
            onPressFavorite={pressToggleFavoriteHandler}
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
