import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FakeInput } from '@/components/ui/form/input';
import { Text } from '@/components/ui/text';
import {
  insertAccountSchema,
  useUpdateAccountBalance,
} from '@/db/actions/account';
import { useMaskCurrency } from '@/hooks/use-mask-currency';
import { getErrorMessage } from '@/lib/utils';

const schema = insertAccountSchema.pick({
  balance: true,
});
type Schema = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function UpdateAccountBalanceScreen() {
  const router = useRouter();
  const { maskCurrency } = useMaskCurrency();
  const searchParams = useLocalSearchParams<{
    balance?: string;
    id?: string;
  }>();
  const defaultBalance = parseInt(searchParams?.balance || '0');
  const { mutateAsync: updateAccountBalance } = useUpdateAccountBalance();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      balance: isNaN(defaultBalance) ? 0 : defaultBalance,
    },
  });

  const balance = watch('balance');
  const submitHandler = handleSubmit(async (data: Schema) => {
    if (!searchParams.id) return;

    try {
      await updateAccountBalance({ id: searchParams.id, values: data });
      router.back();
    } catch (error) {
      setError('root.api', {
        message: getErrorMessage(error),
      });
    }
  });

  if (!Boolean(searchParams.id)) return null;

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

      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={() => {
            router.back();
          }}
          size="lg"
        >
          <Text>Batalkan</Text>
        </Button>
        <Button
          className="flex-1"
          onPress={submitHandler}
          disabled={isSubmitting}
          loading={isSubmitting}
          size="lg"
        >
          <Text>Simpan</Text>
        </Button>
      </View>
    </View>
  );
}
