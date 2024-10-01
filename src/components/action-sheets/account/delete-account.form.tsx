import React from 'react';
import { View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { Text } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useRemoveAccount } from '@/db/actions/account';

const DeleteAccountForm = (props: {
  id: string;
  sheetId: string;
  onPressCancel: () => void;
}) => {
  const { mutateAsync: removeAccount } = useRemoveAccount();

  const pressRemoveHandler = async () => {
    try {
      await removeAccount(props.id);
    } catch (_) {
      // TODO
    } finally {
      setTimeout(() => {
        SheetManager.hide(props.sheetId);
      }, 250);
    }
  };

  return (
    <View className="px-4 pb-6 pt-2">
      <Text className="mb-1 text-2xl font-semibold">Hapus akun?</Text>
      <Text className="mb-4 text-lg">
        Semua riwayat transaksi pada akun ini akan dihapus dan tidak bisa
        dikembalikan!
      </Text>

      <View className="flex-row justify-end gap-2">
        <Button
          variant="destructive"
          onPress={pressRemoveHandler}
          className="flex-1"
        >
          <Text>Hapus</Text>
        </Button>
        <Button
          variant="outline"
          onPress={props.onPressCancel}
          className="flex-1"
        >
          <Text>Batalkan</Text>
        </Button>
      </View>
    </View>
  );
};

export default DeleteAccountForm;
