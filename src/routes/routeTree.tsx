import { createRootRoute, createRoute } from "@tanstack/react-router"

import { isDesignSystemEnabled } from "@/config/designSystem"
import { publicConfig } from "@/config/publicConfig"
import { LocaleLandingPage } from "@/pages/LocaleLandingPage"
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { DesignSystemRoute } from "@/routes/designSystemRoute"
import { RootLayout } from "@/routes/RootLayout"

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LocaleLandingPage,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <LegalDocumentPage kind="privacy" />,
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => <LegalDocumentPage kind="terms" />,
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
  privacyRoute,
  termsRoute,
  ...(designSystemEnabled ? [designSystemRoute] : []),
])
