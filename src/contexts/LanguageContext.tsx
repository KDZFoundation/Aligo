import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, defaultPL?: string, defaultEN?: string) => string;
  tObj: (obj: { pl?: string; en?: string } | string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aligo_language');
    if (saved === 'en' || saved === 'pl') {
      return saved;
    }
    // Check browser default language
    if (typeof window !== 'undefined' && navigator.language.startsWith('en')) {
      return 'en';
    }
    return 'pl';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aligo_language', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pl' ? 'en' : 'pl');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey | string, defaultPL?: string, defaultEN?: string): string => {
    const langDict = translations[language] as Record<string, string>;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    
    // Fallback if key not in dictionary
    if (language === 'en') {
      return defaultEN || defaultPL || key;
    }
    return defaultPL || key;
  };

  const tObj = (obj: { pl?: string; en?: string } | string | null | undefined): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (language === 'en' && obj.en) return obj.en;
    return obj.pl || obj.en || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
