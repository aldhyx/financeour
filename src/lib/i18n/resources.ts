import translation_en_us from '@/translations/en-us.json';
import translation_id_id from '@/translations/id-id.json';

export const resources = {
  en_us: {
    translation: translation_en_us,
  },
  id_id: {
    translation: translation_id_id,
  },
};

export type Language = keyof typeof resources;
export type DefaultLocale = typeof resources.en_us.translation;
