import { zodResolver } from '@hookform/resolvers/zod';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';

import { useAccountTypeListSheetContext } from '@/components/action-sheets/account/account-type-list.sheet';
import { useNumInputSheetContext } from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import { Text } from '@/components/ui/text';
import {
  ACCOUNT_TYPE_ID,
  getAccountTypeLabel,
} from '@/constants/account-types';
import {
  InsertAccount,
  insertAccountSchema,
  useCreateAccount,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

export default function CreateAccountScreen() {
  return <CreateAccountForm />;
}

function CreateAccountForm() {
  const { _ } = useLingui();
  const { showSheetAsync: showAccountTypeSheet } =
    useAccountTypeListSheetContext();
  const { showSheetAsync: showNumInputSheetAsync } = useNumInputSheetContext();

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
    defaultValues: {
      type: ACCOUNT_TYPE_ID.cash,
    },
    resolver: zodResolver(insertAccountSchema),
  });
  const balance = watch('balance');
  const accountType = watch('type');
  const accountTypeLabel = getAccountTypeLabel(accountType);

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

  const selectAccountHandler = async () => {
    Keyboard.dismiss();
    const res = await showAccountTypeSheet({ accountType });
    if (!res) return;
    setValue('type', res.accountType, { shouldValidate: true });
  };

  const pressNumInputHandler = async () => {
    Keyboard.dismiss();
    const res = await showNumInputSheetAsync({ value: balance || 0 });
    if (!res) return;
    setValue('balance', res.value, { shouldValidate: true });
  };

  return (
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
        <Pressable className="active:opacity-50" onPress={selectAccountHandler}>
          <FormGroup.Input
            placeholder={_(msg`Select account type`)}
            disabled
            value={_(accountTypeLabel)}
          />
        </Pressable>
      </FormGroup>

      <FormGroup errorMessage={errors.balance?.message}>
        <FormGroup.Label>
          <Trans>Current balance (optional)</Trans>
        </FormGroup.Label>
        <Pressable className="active:opacity-50" onPress={pressNumInputHandler}>
          <FormGroup.Input disabled value={maskCurrency(balance).masked} />
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
          <Trans>Add account</Trans>
        </Text>
      </Button>
    </View>
  );
}
