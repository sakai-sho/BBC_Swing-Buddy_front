import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dict, type Lang } from './locale';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

function getNested(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('ja');

  useEffect(() => {
    const saved = localStorage.getItem('sb:lang') as Lang | null;
    if (saved && (saved === 'ja' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sb:lang', lang);
  }, [lang]);

  const t = useMemo(
    () => (path: string) => getNested(dict[lang], path) ?? path,
    [lang]
  );

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
};