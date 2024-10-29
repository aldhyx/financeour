/**
 * Supported app language code, for more: {@link https://xml.coverpages.org/iso639a.html}
 */
export const AppLanguageTag = {
  en_US: 'en_US',
  id_ID: 'id_ID',
} as const;

/**
 * Supported app language code, for more: {@link https://xml.coverpages.org/iso639a.html}
 */
export const AppLanguageCode = {
  en: 'en',
  id: 'id',
} as const;

export type AppLanguage = {
  code: keyof typeof AppLanguageCode;
  name: string;
};

/**
 * Supported app language code & name
 */
export const APP_LANGUAGES: AppLanguage[] = [
  { code: AppLanguageCode.en, name: 'English' },
  { code: AppLanguageCode.id, name: 'Bahasa Indonesia – Indonesian' },
];

/**
 * We're using english as default app language
 */
export const DEFAULT_APP_LANGUAGE: AppLanguage = APP_LANGUAGES[0];
