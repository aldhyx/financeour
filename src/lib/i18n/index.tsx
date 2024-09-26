import * as ExpoLocalization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';
import { getLanguage } from './utils';
export * from './utils';

const language = () => {
  const lang = getLanguage() || ExpoLocalization.getLocales()[0].languageTag;

  if (lang) return lang.replace('-', '_');
};

i18n.use(initReactI18next).init({
  resources,
  lng: language(),
  fallbackLng: 'en_US',
  compatibilityJSON: 'v3', // By default React Native projects does not support Intl

  // allows integrating dynamic values into translations.
  interpolation: {
    escapeValue: false, // escape passed in values to avoid XSS injections
  },
});

export default i18n;
