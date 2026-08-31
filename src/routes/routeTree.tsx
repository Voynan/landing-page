import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router"

import { AppProviders } from "@/app/AppProviders"
import { isDesignSystemEnabled } from "@/config/designSystem"
import { publicConfig } from "@/config/publicConfig"
import { LocaleLandingPage } from "@/pages/LocaleLandingPage"
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { DesignSystemRoute } from "@/routes/designSystemRoute"
import { ROOT_LOCALE_STORAGE_KEY, resolveRootLocale } from "@/utils/rootLocale"

const rootRoute = createRootRoute({
  component: () => (
    <AppProviders>
      <Outlet />
    </AppProviders>
  ),
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const savedLocale =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(ROOT_LOCALE_STORAGE_KEY)
    const locale = resolveRootLocale(savedLocale)

    throw redirect({ to: locale === "en" ? "/en" : "/pt" })
  },
})

const portugueseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pt",
  component: () => <LocaleLandingPage locale="pt" />,
})

const englishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/en",
  component: () => <LocaleLandingPage locale="en" />,
})

const portuguesePrivacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pt/privacidade",
  component: () => <LegalDocumentPage locale="pt" kind="privacy" />,
})

const englishPrivacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/en/privacy",
  component: () => <LegalDocumentPage locale="en" kind="privacy" />,
})

const portugueseTermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pt/termos",
  component: () => <LegalDocumentPage locale="pt" kind="terms" />,
})

const englishTermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/en/terms",
  component: () => <LegalDocumentPage locale="en" kind="terms" />,
})

const designSystemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-system",
  component: DesignSystemRoute,
})

const designSystemEnabled = isDesignSystemEnabled({
  dev: publicConfig.isDevelopment,
  flag: publicConfig.enableDesignSystem ? "true" : "false",
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  portugueseRoute,
  englishRoute,
  portuguesePrivacyRoute,
  englishPrivacyRoute,
  portugueseTermsRoute,
  englishTermsRoute,
  ...(designSystemEnabled ? [designSystemRoute] : []),
])
