import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';

import NumInputSheet from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FakeInputBordered } from '@/components/ui/form/input';
import { ErrorScreen } from '@/components/ui/screen/error-screen';
import { Text } from '@/components/ui/text';
import {
  insertAccountSchema,
  useAccountById,
  useUpdateAccountBalance,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

export default function UpdateAccountBalanceScreen() {
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
    <UpdateAccountBalanceForm
      name={data.name}
      id={data.id}
      balance={data.balance}
    />
  );
}

const schema = insertAccountSchema.pick({
  balance: true,
});
type Schema = z.infer<typeof schema>;

function UpdateAccountBalanceForm(props: {
  id: string;
  balance: number | null;
  name: string;
}) {
  const numInputRef = useRef<BottomSheetModal>(null);
  const [renderView, setRenderView] = useState<'numpad' | 'calc'>('numpad');
  const router = useRouter();
  const { maskCurrency } = useMaskCurrency();
  const { mutateAsync: updateAccountBalance } = useUpdateAccountBalance();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      balance: props.balance,
    },
  });

  const balance = watch('balance');
  const submitHandler = handleSubmit(async (data: Schema) => {
    try {
      await updateAccountBalance({ id: props.id, values: data });
      router.back();
    } catch (error) {
      setError('root.api', {
        message: getErrorMessage(error),
      });
    }
  });

  const pressNumInputHandler = () => {
    numInputRef.current?.present();
  };

  return (
    <>
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

      <View className="mb-4 bg-secondary p-4">
        <Text className="text-lg font-bold">{props.name}</Text>
        <Text className="text-sm">Dibuat pada 22 April 2025</Text>
      </View>

      <View className="px-4">
        <TouchableOpacity onPress={pressNumInputHandler}>
          <FakeInputBordered
            label="Saldo saat ini"
            value={maskCurrency(balance).maskedRaw}
            errorText={errors.balance?.message}
          />
        </TouchableOpacity>

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
