import 'dayjs/locale/en';
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import * as ExpoLocalization from 'expo-localization';

import { STORED_KEY } from '@/constants/local-storage-key';
import { storage } from '@/lib/storage';

/**
 * Refers to /src/translations
 */
const LOCALES = {
  en_us: 'en',
  id_id: 'id',
};
type LOCALE = keyof typeof LOCALES;

/**
 * Get user preferred language code from mmkv storage or device, default fallback to en
 */
const getUserPreferredLanguageCode = () => {
  const storedLanguage = storage.getString(STORED_KEY.LANGUAGE);
  const lang = storedLanguage || ExpoLocalization.getLocales()[0].languageTag;
  const langCode = lang.replace('-', '_').toLowerCase() as LOCALE;
  return LOCALES[langCode] || LOCALES.en_us;
};

function initializeDayJs() {
  const locale = getUserPreferredLanguageCode() as LOCALE;
  dayjs.extend(timezone);
  dayjs.extend(isToday);
  dayjs.locale(locale);
}

function changeDayJsLocale(langTag: string) {
  const langCode = langTag.replace('-', '_').toLowerCase() as LOCALE;
  const locale = LOCALES[langCode] || LOCALES.en_us;
  dayjs.locale(locale);
}

export { changeDayJsLocale, initializeDayJs };
