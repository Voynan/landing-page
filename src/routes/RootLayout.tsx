import { Outlet, useRouterState } from "@tanstack/react-router"
import { useMemo } from "react"

import { AppProviders } from "@/app/AppProviders"
import { publicConfig } from "@/config/publicConfig"
import { createAntispamAdapter } from "@/lib/turnstile"
import { LOCALE_QUERY_KEY, resolveLocale } from "@/utils/locale"

export function RootLayout() {
  const search = useRouterState({
    select: (state) => state.location.search as Record<string, unknown>,
  })
  const searchParam = search[LOCALE_QUERY_KEY]

  // Only the URL is consulted here: the server render sees the same query, so
  // the first client render matches the served HTML. The visitor's stored and
  // browser preferences are applied by LocaleProvider after hydration.
  const initialLocale = resolveLocale({
    searchParam: typeof searchParam === "string" ? searchParam : null,
  })

  // Derived from a build-time value only, so the server render and the first
  // client render agree and hydration does not mismatch on the disabled state.
  const requestAntispamToken = useMemo(
    () => createAntispamAdapter(publicConfig.antispamSiteKey),
    [],
  )

  return (
    <AppProviders
      initialLocale={initialLocale}
      requestAntispamToken={requestAntispamToken}
    >
      <Outlet />
    </AppProviders>
  )
}
