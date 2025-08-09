import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/common.json';
import zh from './locales/zh/common.json';
import fr from './locales/fr/common.json';

function applyMeta() {
  const lang = i18n.resolvedLanguage || 'en';
  document.documentElement.lang = lang.startsWith('zh') ? 'zh-CN' : lang;
  const title = i18n.t('meta.title');
  const desc  = i18n.t('meta.description');
  if (title) document.title = title;
  const m = document.querySelector('meta[name="description"]');
  if (m && desc) m.setAttribute('content', desc);
}

i18n.on('initialized', applyMeta);
i18n.on('languageChanged', applyMeta);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, zh: { translation: zh }, fr: { translation: fr } },
    fallbackLng: 'en',
    supportedLngs: ['en','zh','fr'],
    detection: { order: ['querystring','localStorage','navigator'], lookupQuerystring: 'lang', caches: ['localStorage'] },
    interpolation: { escapeValue: false }
  });

export default i18n;
