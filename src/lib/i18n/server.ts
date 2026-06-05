import { cookies } from "next/headers";
import { translations, type Locale, type Translations } from "./translations";

export function getLocale(): Locale {
  const raw = cookies().get("locale")?.value;
  return raw === "en" ? "en" : "mk";
}

export function getT(): Translations {
  return translations[getLocale()];
}
