import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// bundle JSON (no network fetch)
import en from './locales/en/common.json';
import zh from './locales/zh/common.json';
import fr from './locales/fr/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      fr: { translation: fr }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'fr'],
    detection: {
      // shareable: ?lang=en or ?lang=zh, then persist in localStorage
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
