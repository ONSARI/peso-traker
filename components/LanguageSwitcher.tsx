import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage = supportedLngs[i18n.language as keyof typeof supportedLngs];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-text-secondary dark:text-gray-400 hover:text-primary transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-xl">{currentLanguage?.flag || '🌐'}</span>
        <span className="uppercase text-sm font-semibold">{i18n.language}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-card dark:bg-gray-700 rounded-md shadow-lg dark:shadow-none dark:border dark:border-gray-600 z-20 start-0">
          <ul className="py-1">
            {Object.entries(supportedLngs).map(([code, { name, flag }]) => (
              <li key={code}>
                <button
                  onClick={() => changeLanguage(code)}
                  className={`w-full text-left rtl:text-right px-4 py-2 text-sm flex rtl:flex-row-reverse items-center ${i18n.language === code ? 'bg-primary text-white' : 'text-text-primary dark:text-gray-200 hover:bg-background dark:hover:bg-gray-600'}`}
                >
                  <span className="mr-3 rtl:mr-0 rtl:ml-3 text-lg">{flag}</span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};