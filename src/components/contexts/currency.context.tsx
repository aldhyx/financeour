import { getLocales } from 'expo-localization';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, View } from 'react-native';

import { STORED_KEY } from '@/constants/local-storage-key';
import { type AppCurrency, DEFAULT_APP_CURRENCY } from '@/i18n/app-currencies';
import { AppLanguageTag } from '@/i18n/app-languages';
import { storage } from '@/lib/storage';

type CurrencyContext = {
  currencyList: AppCurrency[];
  selectedCurrency: AppCurrency;
  setSelectedCurrency: (languageTag: keyof typeof AppLanguageTag) => void;
};

const currencyContext = createContext<CurrencyContext>({
  currencyList: [],
  selectedCurrency: DEFAULT_APP_CURRENCY,
  setSelectedCurrency() {},
});

export const CurrencyProvider = ({
  children,
  currencyList,
  defaultCurrency,
}: PropsWithChildren & {
  /**
   * currency list catalogs
   */
  currencyList: AppCurrency[];
  /**
   * We used this currency as fallback if nothing match in currency list catalogs
   */
  defaultCurrency: AppCurrency;
}) => {
  const [currency, setCurrency] = useState<AppCurrency>(() => defaultCurrency);
  const [loading, setLoading] = useState(true);
  const locales = getLocales();

  const getCurrency = useCallback(
    (tag: string) => {
      const normalizeTag = tag.replace('-', '_');
      const selectedCurrency = currencyList.find(
        ({ languageTag }) => languageTag === normalizeTag
      );

      return selectedCurrency || defaultCurrency;
    },
    [currencyList, defaultCurrency]
  );

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const storedLagTag = storage.getString(STORED_KEY.LANGUAGE_TAG);
        const userDeviceLangTag = locales[0].languageTag;
        const currency = getCurrency(storedLagTag ?? userDeviceLangTag);
        setCurrency(currency);
      } catch (_) {
        // TODO
      } finally {
        setLoading(false);
      }
    };
    loadCurrency();
  }, [locales, getCurrency]);

  const setSelectedCurrency = useCallback(
    async (tag: string) => {
      try {
        const newCurrency = getCurrency(tag);
        storage.set(STORED_KEY.LANGUAGE_TAG, tag);
        setCurrency(newCurrency);
      } catch (error) {
        console.error('Error updating currency:', error);
      }
    },
    [getCurrency]
  );

  // Show loading indicator until currency is loaded
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <currencyContext.Provider
      value={{ selectedCurrency: currency, setSelectedCurrency, currencyList }}
    >
      {children}
    </currencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(currencyContext);
