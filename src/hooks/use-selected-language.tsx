import { useLingui } from '@lingui/react';
import { useCallback, useMemo } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { STORED_KEY } from '@/constants/local-storage-key';
import {
  APP_LANGUAGES,
  type AppLanguages,
  DEFAULT_APP_LANGUAGE,
} from '@/i18n/app-languages';
import { dynamicActivate } from '@/i18n/i18n';
import { storage } from '@/lib/storage';

export const useSelectedLanguage = () => {
  const { i18n } = useLingui();
  const [languageCode, storeLanguageCode] = useMMKVString(
    STORED_KEY.LANGUAGE_CODE,
    storage
  );

  const selectedLanguage: AppLanguages = useMemo(() => {
    const language = APP_LANGUAGES.find(({ code }) => code === languageCode);
    return language || DEFAULT_APP_LANGUAGE;
  }, [languageCode]);

  const setSelectedLanguage = useCallback(
    async (language: AppLanguages) => {
      const currentActive = i18n.locale;
      if (currentActive === language.code) return;

      await dynamicActivate(language.code);
      storeLanguageCode(language.code);
    },
    [storeLanguageCode, i18n.locale]
  );

  return {
    setSelectedLanguage,
    selectedLanguage,
    languages: APP_LANGUAGES,
  };
};
