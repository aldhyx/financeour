import { useCallback } from 'react';

import { CURRENCY, CURRENCY_FORMAT } from '@/constants/currency';
import { createMaskCurrency, createUnmaskCurrency } from '@/lib/mask';

type MaskFunc = (
  value?: string | number | null
) => ReturnType<typeof createMaskCurrency>;
type UnmaskFunc = (value: string) => ReturnType<typeof createUnmaskCurrency>;

export const useMaskCurrency = (currency: CURRENCY | undefined = 'IDR') => {
  const maskCurrency = useCallback<MaskFunc>(
    (value) => {
      return createMaskCurrency(String(value), CURRENCY_FORMAT[currency]);
    },
    [currency]
  );

  const unmaskCurrency = useCallback<UnmaskFunc>(
    (value) => {
      return createUnmaskCurrency(value, CURRENCY_FORMAT[currency]);
    },
    [currency]
  );

  return { maskCurrency, unmaskCurrency };
};
