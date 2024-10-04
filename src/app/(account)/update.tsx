import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';

import ChooseAccountTypeSheet from '@/components/action-sheets/account/choose-account-type.sheet';
import { Button } from '@/components/ui/button';
import { FakeInput, Input } from '@/components/ui/form/input';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import { Text } from '@/components/ui/text';
import {
  insertAccountSchema,
  useAccountById,
  useUpdateAccount,
} from '@/db/actions/account';
import { getErrorMessage } from '@/lib/utils';

const schema = insertAccountSchema.pick({
  name: true,
  description: true,
  type: true,
});
type Schema = z.infer<typeof schema>;

export default function UpdateAccountScreen() {
  const searchParams = useLocalSearchParams<{
    name?: string;
    description?: string;
    type?: string;
    id?: string;
  }>();
  const { data, isLoading, isError } = useAccountById(searchParams.id);

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <ErrorScreen />;
  if (!data) return null;

  return (
    <UpdateAccountForm
      id={data.id}
      name={data.name}
      description={data.description}
      type={data.type}
    />
  );
}

function UpdateAccountForm(props: {
  name: string;
  description: string | null;
  type: string;
  id: string;
}) {
  const router = useRouter();
  const sheetRef = useRef<BottomSheetModal>(null);
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
      name: props.name,
      description: props.description,
      type: props.type,
    },
  });

  const accountType = watch('type');

  const submitHandler = handleSubmit(async (data: Schema) => {
    try {
      await updateAccount({ id: props.id, values: data });
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
    <>
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

        <Button
          onPress={submitHandler}
          disabled={isSubmitting}
          loading={isSubmitting}
          className="mt-2"
        >
          <Text>Simpan</Text>
        </Button>
      </View>
    </>
  );
}
