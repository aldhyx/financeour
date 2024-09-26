import type TranslateOptions from 'i18next';
import i18n from 'i18next';
import memoize from 'lodash.memoize';
import { useCallback } from 'react';
import { NativeModules, Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import RNRestart from 'react-native-restart';

import { STORED_KEY } from '@/constants/local-storage-key';

import { storage } from '../storage';
import type { DefaultLocale, Language } from './resources';
import type { RecursiveKeyOf } from './types';

export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;
export const translate = memoize(
  (key: TxKeyPath, options = undefined) =>
    i18n.t(key, options) as unknown as string,
  (key: TxKeyPath, options: typeof TranslateOptions) =>
    options ? key + JSON.stringify(options) : key
);

export const getLanguage = () => storage.getString(STORED_KEY.LANGUAGE);

export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang);

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (__DEV__) NativeModules.DevSettings.reload();
    else RNRestart.restart();
  }
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useMMKVString(STORED_KEY.LANGUAGE);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      if (lang !== undefined) changeLanguage(lang as Language);
    },
    [setLang]
  );

  return { language: language as Language, setLanguage };
};
