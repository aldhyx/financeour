import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Button, Text } from '@/components/ui';
import { FakeInput, Input } from '@/components/ui/form';
import {
  InsertAccount,
  insertAccountSchema,
  useCreateAccount,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

// eslint-disable-next-line max-lines-per-function
export default function CreateAccount() {
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
    const result = await SheetManager.show('choose-account-type.sheet', {
      payload: { accountType },
    });

    if (result?.accountType) {
      setValue('type', result.accountType, { shouldValidate: true });
    }
  };

  return (
    <View className="px-3 pt-2">
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
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Input
          label="Saldo awal (opsional)"
          errorText={errors.balance?.message}
          value={maskCurrency(balance).maskedRaw}
          editable={false}
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
      >
        <Text>Simpan</Text>
      </Button>
    </View>
  );
}
