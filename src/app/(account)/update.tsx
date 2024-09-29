import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';

import { Button, Text } from '@/components/ui';
import { FakeInput, Input } from '@/components/ui/form';
import { insertAccountSchema, useUpdateAccount } from '@/db/actions/account';
import { getErrorMessage } from '@/lib/utils';

const schema = insertAccountSchema.pick({
  name: true,
  description: true,
  type: true,
});
type Schema = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function UpdateAccountScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    name?: string;
    description?: string;
    type?: string;
    id?: string;
  }>();
  const { mutateAsync: updateAccount } = useUpdateAccount();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: searchParams?.name,
      description: searchParams?.description,
      type: searchParams?.type,
    },
  });

  const accountType = watch('type');

  const submitHandler = handleSubmit(async (data: Schema) => {
    if (!searchParams.id) return;

    try {
      await updateAccount({ id: searchParams.id, values: data });
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

  if (!Boolean(searchParams.id)) return null;

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

      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={() => {
            router.back();
          }}
        >
          <Text>Batalkan</Text>
        </Button>
        <Button
          className="flex-1"
          onPress={submitHandler}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          <Text>Simpan</Text>
        </Button>
      </View>
    </View>
  );
}
