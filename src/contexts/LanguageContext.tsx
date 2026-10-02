'use client';
import { createContext, useContext, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

const LanguageContext = createContext<{ language: Language; t: typeof translations['ES'] }>({
  language: 'ES',
  t: translations['ES'],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children, language }: { children: ReactNode, language: Language }) => (
  <LanguageContext.Provider value={{ language, t: translations[language] }}>
    {children}
  </LanguageContext.Provider>
);
