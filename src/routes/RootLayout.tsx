import { Outlet, useRouterState } from "@tanstack/react-router"

import { AppProviders } from "@/app/AppProviders"
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

  return (
    <AppProviders initialLocale={initialLocale}>
      <Outlet />
    </AppProviders>
  )
}
