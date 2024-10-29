import { zodResolver } from '@hookform/resolvers/zod';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';
import { z } from 'zod';

import { useAccountListSheetContext } from '@/components/action-sheets/account/account-list.sheet';
import { useNumInputSheetContext } from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import SegmentedControl from '@/components/ui/form/segmented-control';
import { Text } from '@/components/ui/text';
import { TRANSACTION_TYPES } from '@/constants/transaction-types';
import {
  insertTxFormSchema,
  useCreateTransaction,
} from '@/db/actions/transaction';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getToday } from '@/i18n/dayjs-helpers';
import { getErrorMessage } from '@/lib/utils';

export default function CreateTransactionScreen() {
  return <CreateTransactionForm />;
}

const defaultTransactionType = TRANSACTION_TYPES[0];

type Schema = z.infer<typeof insertTxFormSchema>;

// eslint-disable-next-line max-lines-per-function
const CreateTransactionForm = () => {
  const { _ } = useLingui();
  const { showSheetAsync: showAccountSheetAsync } =
    useAccountListSheetContext();
  const { showSheetAsync: showNumInputSheetAsync } = useNumInputSheetContext();

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
      transactionTypeId: defaultTransactionType.id,
    },
  });

  const amount = watch('amount');
  const datetime = watch('datetime');
  const datetimeString = dayjs(datetime).format('dddd, D MMMM YYYY');
  const fromAccount = watch('fromAccount');
  const toAccount = watch('toAccount');
  const transactionTypeId = watch('transactionTypeId');
  const isTransfer = transactionTypeId === 'tf';

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
        type: data.transactionTypeId,
      });

      router.back();
    } catch (error) {
      setError('root.api', { message: getErrorMessage(error) });
    }
  });

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
        { id: res.accountId, name: res.accountName },
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
        { id: res.accountId, name: res.accountName },
        { shouldValidate: true }
      );
    }
  };

  const dateChangeHandler = (event: DateTimePickerEvent, date?: Date) => {
    if (date) setValue('datetime', date, { shouldValidate: true });
  };

  const showDatepicker = () => {
    Keyboard.dismiss();
    DateTimePickerAndroid.open({
      value: datetime,
      onChange: dateChangeHandler,
      mode: 'date',
    });
  };

  return (
    <View className="px-4 pt-2">
      <View className="mb-4">
        <SegmentedControl
          segments={TRANSACTION_TYPES}
          defaultIndex={0}
          onValueChange={(segment) => {
            setValue('transactionTypeId', segment.id);
            if (segment.id !== 'tf') setValue('toAccount', undefined);
          }}
        />
      </View>

      <FormGroup className="mb-4" errorMessage={errors.amount?.message}>
        <Pressable
          className="grow active:opacity-50"
          onPress={showNumInputHandler}
        >
          <FormGroup.Input
            className="h-auto rounded-none border-x-0 border-t-0 border-border bg-background pl-0 text-4xl font-semibold"
            disabled
            value={maskCurrency(amount)}
          />
        </Pressable>
      </FormGroup>

      <FormGroup errorMessage={errors.fromAccount?.message}>
        <FormGroup.Label>
          {isTransfer ? <Trans>From account</Trans> : <Trans>Account</Trans>}
        </FormGroup.Label>
        <Pressable
          className="active:opacity-50"
          onPress={showFromAccountSheetHandler}
        >
          <FormGroup.Input
            placeholder={_(msg`Select account`)}
            disabled
            value={fromAccount?.name ?? ''}
          />
        </Pressable>
      </FormGroup>

      {isTransfer && (
        <FormGroup errorMessage={errors.toAccount?.message}>
          <FormGroup.Label>
            <Trans>To account</Trans>
          </FormGroup.Label>
          <Pressable
            className="active:opacity-50"
            onPress={showToAccountSheetHandler}
          >
            <FormGroup.Input
              placeholder={_(msg`Select account`)}
              disabled
              value={toAccount?.name ?? ''}
            />
          </Pressable>
        </FormGroup>
      )}

      <FormGroup errorMessage={errors.datetime?.message}>
        <FormGroup.Label>
          <Trans>Date</Trans>
        </FormGroup.Label>
        <Pressable className="active:opacity-50" onPress={showDatepicker}>
          <FormGroup.Input
            placeholder={_(msg`Select date`)}
            value={datetimeString}
            disabled
          />
        </Pressable>
        <FormGroup.ErrorMessage />
      </FormGroup>

      <Controller
        control={control}
        render={({ field }) => (
          <FormGroup errorMessage={errors.description?.message}>
            <FormGroup.Label>
              <Trans>Description (optional)</Trans>
            </FormGroup.Label>
            <FormGroup.Input
              placeholder={_(msg`Enter description`)}
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
          <Trans>Add transaction</Trans>
        </Text>
      </Button>
    </View>
  );
};
