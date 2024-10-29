import { AppLanguageTag } from './app-languages';

export type AppCurrency = {
  languageTag: keyof typeof AppLanguageTag;
  digitGroupingSeparator: string;
  decimalSeparator: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
};

/**
 * List of currency used in app
 */
export const APP_CURRENCIES: AppCurrency[] = [
  {
    languageTag: AppLanguageTag.en_US,
    digitGroupingSeparator: ',',
    decimalSeparator: '.',
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
  },
  {
    languageTag: AppLanguageTag.id_ID,
    digitGroupingSeparator: '.',
    decimalSeparator: ',',
    currencyCode: 'IDR',
    currencySymbol: 'Rp',
    currencyName: 'Indonesian Rupiah',
  },
];

/**
 * We're using usd as default app currency
 */
export const DEFAULT_APP_CURRENCY: AppCurrency = APP_CURRENCIES[0];
