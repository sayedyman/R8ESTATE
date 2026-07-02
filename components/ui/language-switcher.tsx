"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Globe, Check } from "lucide-react"
import { locales, localeConfigs, type Locale, LOCALE_COOKIE } from "@/i18n/config"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

/**
 * LanguageSwitcher — compact globe-icon dropdown to switch between en/ar.
 *
 * Persistence:
 * - Always writes NEXT_LOCALE cookie (7-day expiry).
 * - If user is authenticated, also PATCHes /api/user/locale to persist across devices.
 */
export function LanguageSwitcher() {
  const t = useTranslations("language")
  const router = useRouter()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentLocale, setCurrentLocale] = React.useState<Locale>("en")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Read current locale from cookie on mount
  React.useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
    const value = cookie?.split("=")[1]
    if (value === "en" || value === "ar") {
      setCurrentLocale(value)
    }
  }, [])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = async (locale: Locale) => {
    setIsOpen(false)
    if (locale === currentLocale) return

    // Write the cookie (7-day expiry)
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`

    // Persist to Supabase profile if authenticated
    if (session?.user?.id) {
      try {
        await fetch("/api/user/locale", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale }),
        })
      } catch {
        // Non-critical — cookie already set
      }
    }

    // Refresh the page so the server re-reads the new locale cookie
    router.refresh()
  }

  const currentConfig = localeConfigs[currentLocale]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={t("switchLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">
          {currentLocale.toUpperCase()}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            role="listbox"
            aria-label={t("switchLanguage")}
            className="absolute end-0 mt-1.5 w-40 rounded-xl border border-border bg-card shadow-lg shadow-slate-200/50 overflow-hidden z-50"
          >
            {locales.map((locale) => {
              const config = localeConfigs[locale]
              const isActive = locale === currentLocale
              return (
                <button
                  key={locale}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(locale)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium transition-colors text-start
                    ${isActive
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-muted"
                    }`}
                  dir={config.dir}
                >
                  <span>{config.nativeName}</span>
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
