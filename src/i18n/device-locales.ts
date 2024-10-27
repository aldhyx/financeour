import { getLocales as defaultGetLocales } from 'expo-localization';

import { removeDuplicateArray } from '@/lib/utils';

/**
 * Handles legacy migration for Java devices.
 *
 * {@link https://stackoverflow.com/questions/55955641/correct-locale-for-indonesia-id-id-vs-in-id}
 */
function fixLegacyLanguageCode(code: string): string {
  if (code === 'in') return 'id'; // indonesian
  if (code === 'iw') return 'he'; // hebrew
  if (code === 'ji') return 'yi'; // yiddish
  return code;
}

/**
 * Normalized getLocales from expo-localization
 */
function getLocales() {
  const locales = defaultGetLocales();
  const newLocales = locales.map((locale) => {
    if (typeof locale.languageCode === 'string') {
      // change legacy language code
      locale.languageCode = fixLegacyLanguageCode(locale.languageCode);
    }
    return locale;
  });

  return newLocales;
}

/**
 * User device locales
 */
export const deviceLocales = getLocales();

/**
 * User device locales code
 * BCP-47 language tag without region e.g. array of 2-char lang codes
 */
export const deviceLanguageCodes = removeDuplicateArray(
  deviceLocales.map(({ languageCode }) => languageCode)
);
