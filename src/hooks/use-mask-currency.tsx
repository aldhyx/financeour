import { useCallback } from 'react';

import { useCurrencyContext } from '@/components/contexts/currency.context';

type Props = {
  style: 'decimal' | 'currency';
};

export const useMaskCurrency = (
  props: Props = {
    style: 'currency',
  }
) => {
  const { selectedCurrency } = useCurrencyContext();
  const languageTag = selectedCurrency.languageTag.replaceAll('_', '-');
  const currencyCode = selectedCurrency.currencyCode;

  const maskCurrency = useCallback(
    (value?: number | string | null) => {
      let val = Number(value);
      val = isNaN(val) ? 0 : val;

      const masked = new Intl.NumberFormat(languageTag, {
        currency: currencyCode,
        style: props.style,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0, // Allows no decimal places if not necessary.
        maximumFractionDigits: 3, // Ensures no rounding by allowing up to 3 decimal places.
      }).format(val);

      return masked;
    },
    [currencyCode, languageTag, props.style]
  );

  return { maskCurrency };
};
