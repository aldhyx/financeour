import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';

import ChooseAccountTypeSheet from '@/components/action-sheets/account/choose-account-type.sheet';
import NumInputSheet from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import { Text } from '@/components/ui/text';
import {
  InsertAccount,
  insertAccountSchema,
  useCreateAccount,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

export default function CreateAccountScreen() {
  const accountTypeRef = useRef<BottomSheetModal>(null);
  const numInputRef = useRef<BottomSheetModal>(null);
  const [renderView, setRenderView] = useState<'numpad' | 'calc'>('numpad');

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

  const pressChooseAccountHandler = () => {
    Keyboard.dismiss();
    accountTypeRef.current?.present();
  };

  const pressNumInputHandler = () => {
    Keyboard.dismiss();
    numInputRef.current?.present();
  };

  const pressRadioHandler = (val: string) => {
    setValue('type', val, { shouldValidate: true });
    accountTypeRef.current?.close();
  };

  return (
    <>
      <ChooseAccountTypeSheet
        ref={accountTypeRef}
        value={accountType}
        onPressRadio={pressRadioHandler}
      />
      <NumInputSheet
        ref={numInputRef}
        amount={balance || 0}
        renderView={renderView}
        renderViewCalc={() => {
          numInputRef.current?.snapToIndex(1);
          setRenderView('calc');
        }}
        renderViewNumpad={() => {
          numInputRef.current?.snapToIndex(0);
          setRenderView('numpad');
        }}
        setAmount={(result: number) => {
          setValue('balance', result);
          numInputRef.current?.close();
        }}
      />

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
              className="capitalize"
              disabled
              value={accountType}
            />
          </Pressable>
        </FormGroup>

        <FormGroup errorMessage={errors.balance?.message}>
          <FormGroup.Label>Saldo awal (opsional)</FormGroup.Label>
          <Pressable
            className="active:opacity-50"
            onPress={pressNumInputHandler}
          >
            <FormGroup.Input
              placeholder="Pilih tipe akun..."
              className="capitalize"
              disabled
              value={maskCurrency(balance).maskedRaw}
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
