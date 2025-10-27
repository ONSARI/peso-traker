import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';


export const supportedLngs = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  bn: { name: 'বাংলা', flag: '🇧🇩' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  pt: { name: 'Português', flag: '🇵🇹' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  yo: { name: 'Yorùbá', flag: '🇳🇬' },
  ja: { name: '日本語', flag: '🇯🇵' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ur: { name: 'اردو', flag: '🇵🇰' },
  fa: { name: 'فارسی', flag: '🇮🇷' },
  he: { name: 'עברית', flag: '🇮🇱' },
};

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(supportedLngs),
    debug: false,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

export default i18next;
