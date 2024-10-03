import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ChooseAccountTypeSheet from '@/components/action-sheets/account/choose-account-type.sheet';
import { Button } from '@/components/ui/button';
import { FakeInput, Input } from '@/components/ui/form/input';
import { Text } from '@/components/ui/text';
import {
  InsertAccount,
  insertAccountSchema,
  useCreateAccount,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

export default function CreateAccountScreen() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { maskCurrency } = useMaskCurrency();
  const { mutateAsync: createAccount } = useCreateAccount();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    setValue,
  } = useForm<InsertAccount>({
    resolver: zodResolver(insertAccountSchema),
  });
  const balance = watch('balance');
  const accountType = watch('type');

  const submitHandler = handleSubmit(async (data: InsertAccount) => {
    try {
      await createAccount(data);
      router.back();
    } catch (error) {
      setError('root.api', {
        message: getErrorMessage(error),
      });
    }
  });

  const pressChooseAccountHandler = async () => {
    Keyboard.dismiss();
    sheetRef.current?.present();
  };

  const pressRadioHandler = (val: string) => {
    setValue('type', val, { shouldValidate: true });
    sheetRef.current?.close();
  };

  return (
    <BottomSheetModalProvider>
      <ChooseAccountTypeSheet
        ref={sheetRef}
        value={accountType}
        onPressRadio={pressRadioHandler}
      />

      <View className="px-4 pt-4">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nama"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorText={errors.name?.message}
              placeholder="Isi nama akun..."
              size="lg"
            />
          )}
          name="name"
        />

        <TouchableOpacity onPress={pressChooseAccountHandler}>
          <FakeInput
            placeholder="Pilih tipe akun..."
            label="Tipe akun"
            value={accountType}
            errorText={errors.type?.message}
            className="capitalize"
            size="lg"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <FakeInput
            label="Saldo awal (opsional)"
            errorText={errors.balance?.message}
            value={maskCurrency(balance).maskedRaw}
            size="lg"
          />
        </TouchableOpacity>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Isi keterangan..."
              label="Keterangan (opsional)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              inputMode="text"
              errorText={errors.description?.message}
              size="lg"
            />
          )}
          name="description"
        />

        {Boolean(errors.root?.api.message) && (
          <Text className="mb-4 text-sm text-destructive">
            {errors.root?.api.message}
          </Text>
        )}

        <Button
          onPress={submitHandler}
          disabled={isSubmitting}
          loading={isSubmitting}
          size="lg"
        >
          <Text>Simpan</Text>
        </Button>
      </View>
    </BottomSheetModalProvider>
  );
}
