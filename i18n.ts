import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Fix: Export supportedLngs for the language switcher component.
export const supportedLngs = {
  es: { name: 'Español', flag: '🇪🇸' },
};

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'es',
    fallbackLng: 'es',
    // Fix: Use the keys from the supportedLngs object to keep config consistent.
    supportedLngs: Object.keys(supportedLngs),
    debug: false,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18next;
