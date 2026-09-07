import type { ReactNode } from "react"
import { useMemo } from "react"
import { I18nextProvider } from "react-i18next"
import { QueryClientProvider } from "@tanstack/react-query"

import { ContactRuntimeProvider } from "@/app/ContactRuntime"
import type { AntispamTokenAdapter } from "@/app/contactRuntimeContext"
import { LocaleProvider } from "@/app/LocaleProvider"
import type { Locale } from "@/content/contracts"
import { createI18n } from "@/i18n"
import { createQueryClient } from "@/lib/queryClient"

type AppProvidersProps = {
  children: ReactNode
  initialLocale?: Locale
  requestAntispamToken?: AntispamTokenAdapter
}

export function AppProviders({
  children,
  initialLocale = "en",
  requestAntispamToken,
}: AppProvidersProps) {
  const i18n = useMemo(() => createI18n(initialLocale), [initialLocale])
  const queryClient = useMemo(() => createQueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <LocaleProvider initialLocale={initialLocale}>
          <ContactRuntimeProvider requestAntispamToken={requestAntispamToken}>
            {children}
          </ContactRuntimeProvider>
        </LocaleProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
