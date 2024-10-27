import { zodResolver } from '@hookform/resolvers/zod';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import { z } from 'zod';

import { useAccountTypeListSheetContext } from '@/components/action-sheets/account/account-type-list.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import { HeaderBar } from '@/components/ui/header-bar';
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
    id: string;
  }>();
  const { data, isLoading, isError } = useAccountById(searchParams.id);

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <ErrorScreen />;
  if (!data) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: data.name,
          header({ options }) {
            return <HeaderBar title={options.title} leftIcon="cancel" />;
          },
        }}
      />

      <UpdateAccountForm
        id={data.id}
        name={data.name}
        description={data.description}
        type={data.type}
      />
    </>
  );
}

function UpdateAccountForm(props: {
  name: string;
  description: string | null;
  type: string;
  id: string;
}) {
  const { _ } = useLingui();

  const { showSheetAsync: showAccountTypeSheet } =
    useAccountTypeListSheetContext();

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

  const selectAccountTypeHandler = async () => {
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
              <FormGroup.Label>
                <Trans>Name</Trans>
              </FormGroup.Label>
              <FormGroup.Input
                placeholder={_(msg`e.g. Bank XY, Saving Wallet`)}
                {...field}
              />
            </FormGroup>
          )}
          name="name"
        />

        <FormGroup errorMessage={errors.type?.message}>
          <FormGroup.Label>
            <Trans>Account type</Trans>
          </FormGroup.Label>
          <Pressable
            className="active:opacity-50"
            onPress={selectAccountTypeHandler}
          >
            <FormGroup.Input
              placeholder={_(msg`Select account type`)}
              disabled
              value={accountType}
            />
          </Pressable>
        </FormGroup>

        <Controller
          control={control}
          render={({ field }) => (
            <FormGroup errorMessage={errors.description?.message}>
              <FormGroup.Label>
                <Trans>Description (optional)</Trans>
              </FormGroup.Label>
              <FormGroup.Input
                placeholder={_(msg`e.g. Personal saving for vacation`)}
                {...field}
              />
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
        >
          <Text>
            <Trans>Save changes</Trans>
          </Text>
        </Button>
      </View>
    </>
  );
}
