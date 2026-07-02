import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLocale, isValidLocale, type Locale } from './config'

/**
 * next-intl server-side locale resolution.
 *
 * Resolution order:
 *  1. NEXT_LOCALE cookie
 *  2. Default locale (en)
 *
 * No URL prefix strategy — locale lives in the cookie only.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

  const locale: Locale = isValidLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
