import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationHI from './locales/hi.json';
import translationTA from './locales/ta.json';
import translationML from './locales/ml.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  hi: {
    translation: translationHI
  },
  ta: {
    translation: translationTA
  },
  ml: {
    translation: translationML
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 