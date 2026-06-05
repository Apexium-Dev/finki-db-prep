"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Locale, type Translations } from "@/lib/i18n/translations";

interface LangCtx {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const Ctx = createContext<LangCtx>({ locale: "mk", t: translations.mk, setLocale: () => {} });

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `locale=${l};path=/;max-age=31536000;samesite=lax`;
  }, []);

  return (
    <Ctx.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLanguage() {
  return useContext(Ctx);
}
