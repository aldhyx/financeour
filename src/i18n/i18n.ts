// Don't remove -force from these because detection is VERY slow on low-end Android.
// https://github.com/formatjs/formatjs/issues/4463#issuecomment-2176070577
import '@formatjs/intl-locale/polyfill-force';
import '@formatjs/intl-pluralrules/polyfill-force';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-numberformat/locale-data/en';

import { i18n } from '@lingui/core';
import dayjs from 'dayjs';

import { STORED_KEY } from '@/constants/local-storage-key';
import { messages as messageEn } from '@/i18n/locales/en/messages';
import { storage } from '@/lib/storage';

import { DEFAULT_APP_LANGUAGE } from './app-languages';
import { deviceLocales } from './device-locales';

/**
 * Used in the root to initialize i18n from persisted store or user device
 */
export const loadSelectedLocale = () => {
  const storedLangCode = storage.getString(STORED_KEY.LANGUAGE_CODE);

  if (storedLangCode && typeof storedLangCode === 'string') {
    dynamicActivate(storedLangCode);
  } else {
    dynamicActivate(deviceLocales[0].languageCode);
  }
};

/**
 * Do a dynamic import of just the catalog that we need
 *
 * We also change dayjs locale as well as locale changes
 *
 * Load english as default locale if nothing match
 */
export const dynamicActivate = async (locale?: string | null) => {
  if (locale === 'id') {
    const { messages } = await import(`./locales/id/messages.js`);
    await Promise.all([
      import('@formatjs/intl-pluralrules/locale-data/id'),
      import('@formatjs/intl-numberformat/locale-data/id'),
      import('dayjs/locale/id'),
    ]);
    i18n.loadAndActivate({ locale, messages });
    dayjs.locale('id');
    return;
  }

  // If nothing match, load english as default language
  i18n.loadAndActivate({
    locale: DEFAULT_APP_LANGUAGE.code,
    messages: messageEn,
  });
  dayjs.locale('en');
};
