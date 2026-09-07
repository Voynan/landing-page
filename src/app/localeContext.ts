import { createContext } from "react"

import type { Locale } from "@/content/contracts"

export type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
