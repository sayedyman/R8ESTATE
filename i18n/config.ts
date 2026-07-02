/**
 * i18n configuration — single source of truth for locale metadata.
 * Add new locales here and they'll propagate throughout the app.
 */

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export interface LocaleConfig {
  code: Locale
  name: string          // Display name in that language
  nativeName: string    // Native script
  dir: 'ltr' | 'rtl'
  lang: string          // HTML lang attribute
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    lang: 'en',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    lang: 'ar',
  },
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale] ?? localeConfigs[defaultLocale]
}

export function isValidLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale)
}
