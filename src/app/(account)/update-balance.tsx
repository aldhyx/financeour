import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard, Pressable, View } from 'react-native';
import { z } from 'zod';

import {
  NumInputSheetProvider,
  useNumInputSheetContext,
} from '@/components/action-sheets/general/num-input.sheet';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui/form/form';
import { HeaderBar } from '@/components/ui/header-bar';
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

      <NumInputSheetProvider>
        <UpdateAccountBalanceForm
          name={data.name}
          id={data.id}
          balance={data.balance}
        />
      </NumInputSheetProvider>
    </>
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
  const { showSheetAsync: showNumInputSheetAsync } = useNumInputSheetContext();
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

  const pressNumInputHandler = async () => {
    Keyboard.dismiss();
    const res = await showNumInputSheetAsync({ value: balance || 0 });
    if (!res) return;
    setValue('balance', res.value, { shouldValidate: true });
  };

  return (
    <>
      <View className="mt-2 px-4">
        <FormGroup errorMessage={errors.balance?.message}>
          <FormGroup.Label>Current balance</FormGroup.Label>

          <View className="flex-row items-baseline justify-start gap-3">
            <Text className="text-2xl font-medium leading-none">Rp</Text>

            <Pressable
              className="grow active:opacity-50"
              onPress={pressNumInputHandler}
            >
              <FormGroup.Input
                className="h-auto rounded-none border-x-0 border-t-0 border-border bg-background pl-0 text-4xl font-semibold"
                disabled
                value={maskCurrency(balance).maskedRaw}
              />
            </Pressable>
          </View>
          <FormGroup.ErrorMessage className="ml-9" />
        </FormGroup>

        <FormGroup errorMessage={errors.root?.api.message}>
          <FormGroup.ErrorMessage />
        </FormGroup>

        <Button
          onPress={submitHandler}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          <Text>Update balance</Text>
        </Button>
      </View>
    </>
  );
}
