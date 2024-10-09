import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';
import { z } from 'zod';

import {
  AccountSheet,
  AccountSheetProvider,
  useAccountSheetContext,
} from '@/components/action-sheets/account/choose-account.sheet';
import {
  NumInputSheet,
  NumInputSheetProvider,
  useNumInputSheetContext,
} from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import { SegmentedControl } from '@/components/ui/form/segmented-control';
import { Text } from '@/components/ui/text';
import { TRANSACTION_TYPES } from '@/constants/app';
import {
  insertTxFormSchema,
  useCreateTransaction,
} from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { dateToString, getToday } from '@/lib/dayjs';
import { getErrorMessage } from '@/lib/utils';

export default function CreateTransactionScreen() {
  return (
    <NumInputSheetProvider>
      <AccountSheetProvider>
        <AccountSheet />
        <NumInputSheet />
        <CreateTransactionForm />
      </AccountSheetProvider>
    </NumInputSheetProvider>
  );
}

const defaultTransactionType = TRANSACTION_TYPES[0];

type Schema = z.infer<typeof insertTxFormSchema>;

// eslint-disable-next-line max-lines-per-function
const CreateTransactionForm = () => {
  const { sheetPresentAsync: showAccountSheetAsync } = useAccountSheetContext();
  const { sheetPresentAsync: showNumInputSheetAsync } =
    useNumInputSheetContext();

  const { mutateAsync: create } = useCreateTransaction();
  const { maskCurrency } = useMaskCurrency();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(insertTxFormSchema),
    defaultValues: {
      datetime: getToday(),
      transactionType: defaultTransactionType,
    },
  });

  const amount = watch('amount');
  const datetime = watch('datetime');
  const datetimeString = dateToString(datetime);
  const fromAccount = watch('fromAccount');
  const toAccount = watch('toAccount');
  const transactionType = watch('transactionType');
  const isTransfer = transactionType.key === 'tf';

  const submitHandler = handleSubmit(async (data: Schema) => {
    try {
      await create({
        fromAccountId: data.fromAccount.id,
        fromAccountName: data.fromAccount.name,
        toAccountId: data.toAccount?.id,
        toAccountName: data.toAccount?.name,
        amount: data.amount,
        datetime: data.datetime,
        description: data.description,
        type: data.transactionType.key,
      });

      router.back();
    } catch (error) {
      setError('root.api', {
        message: getErrorMessage(error),
      });
    }
  });

  const txTypeChangeHandler = (option: (typeof TRANSACTION_TYPES)[0]) => {
    setValue('transactionType', option);
    if (option.key !== 'tf') setValue('toAccount', undefined);
  };

  const showNumInputHandler = async () => {
    Keyboard.dismiss();
    const res = await showNumInputSheetAsync({ value: amount || 0 });
    if (!res) return;
    setValue('amount', res.value, { shouldValidate: true });
  };

  const showFromAccountSheetHandler = async () => {
    Keyboard.dismiss();
    const res = await showAccountSheetAsync({
      accountId: fromAccount?.id,
      accountName: fromAccount?.name,
    });

    if (res) {
      setValue(
        'fromAccount',
        {
          id: res.accountId,
          name: res.accountName,
        },
        { shouldValidate: true }
      );
    }
  };

  const showToAccountSheetHandler = async () => {
    Keyboard.dismiss();
    const res = await showAccountSheetAsync({
      accountId: toAccount?.id,
      accountName: toAccount?.name,
    });

    if (res) {
      setValue(
        'toAccount',
        {
          id: res.accountId,
          name: res.accountName,
        },
        { shouldValidate: true }
      );
    }
  };

  return (
    <View className="px-4 pt-2">
      <View className="mb-4">
        <SegmentedControl
          options={TRANSACTION_TYPES}
          selectedOption={transactionType}
          onOptionPress={txTypeChangeHandler}
        />
      </View>

      <FormGroup className="mb-4" errorMessage={errors.amount?.message}>
        <View className="flex-row items-baseline justify-start gap-3">
          <Text className="text-2xl font-medium">Rp</Text>
          <Pressable
            className="grow active:opacity-50"
            onPress={showNumInputHandler}
          >
            <FormGroup.Input
              className="h-auto rounded-none border-x-0 border-t-0 border-border bg-background pl-0 text-4xl font-semibold"
              disabled
              value={maskCurrency(amount).maskedRaw}
            />
          </Pressable>
        </View>
      </FormGroup>

      <FormGroup errorMessage={errors.fromAccount?.message}>
        <FormGroup.Label>{isTransfer ? 'Dari akun' : 'Akun'}</FormGroup.Label>
        <Pressable
          className="active:opacity-50"
          onPress={showFromAccountSheetHandler}
        >
          <FormGroup.Input
            placeholder="Pilih akun..."
            disabled
            value={fromAccount?.name ?? ''}
          />
        </Pressable>
      </FormGroup>

      {isTransfer && (
        <FormGroup errorMessage={errors.toAccount?.message}>
          <FormGroup.Label>Ke akun</FormGroup.Label>
          <Pressable
            className="active:opacity-50"
            onPress={showToAccountSheetHandler}
          >
            <FormGroup.Input
              placeholder="Pilih akun..."
              disabled
              value={toAccount?.name ?? ''}
            />
          </Pressable>
        </FormGroup>
      )}

      <FormGroup errorMessage={errors.datetime?.message}>
        <FormGroup.Label>Tanggal</FormGroup.Label>
        <FormGroup.Input
          placeholder="Pilih tanggal..."
          value={datetimeString}
          disabled
        />
        <FormGroup.ErrorMessage />
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
  );
};
