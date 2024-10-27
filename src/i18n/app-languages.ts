/**
 * Supported app language code, for more: {@link https://xml.coverpages.org/iso639a.html}
 */
export const AppLanguageCode = {
  en: 'en',
  id: 'id',
} as const;

export type AppLanguages = {
  code: keyof typeof AppLanguageCode;
  name: string;
};

/**
 * Supported app language code & name
 */
export const APP_LANGUAGES: AppLanguages[] = [
  { code: AppLanguageCode.en, name: 'English' },
  { code: AppLanguageCode.id, name: 'Bahasa Indonesia – Indonesian' },
];

/**
 * We're using english as default app language
 */
export const DEFAULT_APP_LANGUAGE: AppLanguages = APP_LANGUAGES[0];
