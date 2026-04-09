import { useAppStore } from "@/store/store";
import zh from "./zh";
import en from "./en";
import type { Translations } from "./zh";

export type Locale = "zh" | "en";

const translations: Record<Locale, Translations> = { zh, en };

/** Returns the current translation object based on store locale */
export function useT(): Translations {
  const locale = useAppStore((s) => s.locale);
  return translations[locale];
}

/** Returns the current locale */
export function useLocale(): Locale {
  return useAppStore((s) => s.locale);
}
