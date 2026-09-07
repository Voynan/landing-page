import { createContext, useContext } from "react"

import type { Locale } from "@/content/contracts"

export type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)

  if (!value) {
    throw new Error("useLocale must be used inside a LocaleProvider")
  }

  return value
}
