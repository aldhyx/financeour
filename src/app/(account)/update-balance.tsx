import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FakeInput } from '@/components/ui/form/input';
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

  return <UpdateAccountBalanceForm id={data.id} balance={data.balance} />;
}

const schema = insertAccountSchema.pick({
  balance: true,
});
type Schema = z.infer<typeof schema>;

function UpdateAccountBalanceForm(props: {
  id: string;
  balance: number | null;
}) {
  const router = useRouter();
  const { maskCurrency } = useMaskCurrency();
  const { mutateAsync: updateAccountBalance } = useUpdateAccountBalance();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
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

  return (
    <View className="px-4 pt-4">
      <TouchableOpacity>
        <FakeInput
          label="Saldo saat ini"
          errorText={errors.balance?.message}
          value={maskCurrency(balance).masked}
          size="lg"
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
        size="lg"
      >
        <Text>Simpan</Text>
      </Button>
    </View>
  );
}
