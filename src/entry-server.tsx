import { RouterProvider } from "@tanstack/react-router"
import { renderToStaticMarkup, renderToString } from "react-dom/server"

import { createAppRouter } from "@/app/createAppRouter"
import { LocaleSeo } from "@/components/seo/LocaleSeo"
import { publicConfig } from "@/config/publicConfig"
import { getLandingContent, type Locale } from "@/content"
import {
  getLegalDocument,
  legalPaths,
  type LegalDocumentKind,
} from "@/content/legal"

export type PublicRoute =
  "/pt" | "/en" | "/pt/privacidade" | "/en/privacy" | "/pt/termos" | "/en/terms"

export type RenderedPage = {
  appHtml: string
  headHtml: string
  htmlAttrs: string
}

type RenderOptions = {
  origin?: string
}

const previewOrigin = "http://localhost:4173"

const legalRouteDescriptors = {
  "/pt/privacidade": { locale: "pt", kind: "privacy" },
  "/en/privacy": { locale: "en", kind: "privacy" },
  "/pt/termos": { locale: "pt", kind: "terms" },
  "/en/terms": { locale: "en", kind: "terms" },
} satisfies Partial<
  Record<PublicRoute, { locale: Locale; kind: LegalDocumentKind }>
>

export async function render(
  url: PublicRoute,
  options: RenderOptions = {},
): Promise<RenderedPage> {
  const router = createAppRouter(url)
  const legalRoute =
    legalRouteDescriptors[url as keyof typeof legalRouteDescriptors]
  const locale: Locale = legalRoute?.locale ?? (url === "/en" ? "en" : "pt")
  const metadata = legalRoute
    ? getLegalDocument(locale, legalRoute.kind).metadata
    : getLandingContent(locale).metadata
  const pathsByLocale = legalRoute ? legalPaths[legalRoute.kind] : undefined
  const origin = options.origin ?? publicConfig.siteOrigin ?? previewOrigin

  await router.load()

  return {
    appHtml: renderToString(<RouterProvider router={router} />),
    headHtml: renderToStaticMarkup(
      <LocaleSeo
        locale={locale}
        metadata={metadata}
        origin={origin}
        pathsByLocale={pathsByLocale}
      />,
    ),
    htmlAttrs: locale === "pt" ? 'lang="pt-BR"' : 'lang="en"',
  }
}
