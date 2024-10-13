import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import { z } from 'zod';

import {
  AccountTypeSheetProvider,
  useAccountTypeSheetContext,
} from '@/components/action-sheets/account/choose-account-type.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
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
    <AccountTypeSheetProvider>
      <UpdateAccountForm
        id={data.id}
        name={data.name}
        description={data.description}
        type={data.type}
      />
    </AccountTypeSheetProvider>
  );
}

function UpdateAccountForm(props: {
  name: string;
  description: string | null;
  type: string;
  id: string;
}) {
  const { showSheetAsync: showAccountTypeSheet } = useAccountTypeSheetContext();

  const router = useRouter();
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
    const res = await showAccountTypeSheet({ accountType });
    if (!res) return;
    setValue('type', res.accountType, { shouldValidate: true });
  };

  return (
    <>
      <View className="px-4 pt-4">
        <Controller
          control={control}
          render={({ field }) => (
            <FormGroup errorMessage={errors.name?.message}>
              <FormGroup.Label>Nama</FormGroup.Label>
              <FormGroup.Input placeholder="Isi nama akun..." {...field} />
            </FormGroup>
          )}
          name="name"
        />

        <FormGroup errorMessage={errors.type?.message}>
          <FormGroup.Label>Tipe akun</FormGroup.Label>
          <Pressable
            className="active:opacity-50"
            onPress={pressChooseAccountHandler}
          >
            <FormGroup.Input
              placeholder="Pilih tipe akun..."
              disabled
              value={accountType}
            />
          </Pressable>
        </FormGroup>

        <Controller
          control={control}
          render={({ field }) => (
            <FormGroup errorMessage={errors.description?.message}>
              <FormGroup.Label>Keterangan (opsional)</FormGroup.Label>
              <FormGroup.Input placeholder="Isi keterangan..." {...field} />
              <FormGroup.ErrorMessage />
            </FormGroup>
          )}
          name="description"
        />

        <FormGroup errorMessage={errors.root?.api.message}>
          <FormGroup.ErrorMessage />
        </FormGroup>

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
