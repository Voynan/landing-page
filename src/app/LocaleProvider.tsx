import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { LocaleContext, type LocaleContextValue } from "@/app/localeContext"
import type { Locale } from "@/content/contracts"
import {
  applyLocaleToUrl,
  htmlLang,
  LOCALE_QUERY_KEY,
  LOCALE_STORAGE_KEY,
  resolveLocale,
} from "@/utils/locale"

type LocaleProviderProps = {
  children: ReactNode
  initialLocale: Locale
}

function readStoredLocale(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    // A blocked storage falls back to a session-only preference.
    return null
  }
}

function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // A blocked storage falls back to a session-only preference.
  }
}

export function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  const { i18n } = useTranslation()
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next)
      void i18n.changeLanguage(next)

      if (typeof document !== "undefined") {
        document.documentElement.lang = htmlLang(next)
      }

      if (typeof window === "undefined") {
        return
      }

      persistLocale(next)

      // TanStack Router's browser history observes history.replaceState, so the
      // router location stays in sync without a navigation.
      window.history.replaceState(
        window.history.state,
        "",
        applyLocaleToUrl(new URL(window.location.href), next).toString(),
      )
    },
    [i18n],
  )

  useEffect(() => {
    const resolved = resolveLocale({
      searchParam: new URLSearchParams(window.location.search).get(
        LOCALE_QUERY_KEY,
      ),
      stored: readStoredLocale(),
      preferredLanguages: window.navigator.languages,
    })

    if (resolved !== locale) {
      setLocale(resolved)
    }
  }, [locale, setLocale])

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)

  if (!value) {
    throw new Error("useLocale must be used inside a LocaleProvider")
  }

  return value
}
