import type { ReactNode } from "react"
import { useMemo } from "react"
import { I18nextProvider } from "react-i18next"

import type { Locale } from "@/content/contracts"
import { createI18n } from "@/i18n"

type AppProvidersProps = {
  children: ReactNode
  locale?: Locale
}

export function AppProviders({ children, locale = "pt" }: AppProvidersProps) {
  const i18n = useMemo(() => createI18n(locale), [locale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
