import translation_en_US from '@/translations/en-US.json';
import translation_id_ID from '@/translations/id-ID.json';

export const resources = {
  en_US: {
    translation: translation_en_US,
  },
  id_ID: {
    translation: translation_id_ID,
  },
};

export type Language = keyof typeof resources;
export type DefaultLocale = typeof resources.en_US.translation;
