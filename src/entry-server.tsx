import { RouterProvider } from "@tanstack/react-router"
import { renderToStaticMarkup, renderToString } from "react-dom/server"

import { createAppRouter } from "@/app/createAppRouter"
import { LocaleSeo } from "@/components/seo/LocaleSeo"
import { publicConfig } from "@/config/publicConfig"
import { getLandingContent } from "@/content"
import {
  getLegalDocument,
  legalPaths,
  type LegalDocumentKind,
} from "@/content/legal"
import { htmlLang, LOCALE_QUERY_KEY, resolveLocale } from "@/utils/locale"

export type PublicRoute =
  | "/"
  | "/privacy"
  | "/terms"
  | "/?lang=pt"
  | "/privacy?lang=pt"
  | "/terms?lang=pt"

export type RenderedPage = {
  appHtml: string
  headHtml: string
  htmlAttrs: string
}

type RenderOptions = {
  origin?: string
}

const previewOrigin = "http://localhost:4173"

const legalKindByPath: Record<string, LegalDocumentKind> = {
  [legalPaths.privacy]: "privacy",
  [legalPaths.terms]: "terms",
}

export async function render(
  url: PublicRoute,
  options: RenderOptions = {},
): Promise<RenderedPage> {
  const parsedUrl = new URL(url, "https://voynan.local")
  const locale = resolveLocale({
    searchParam: parsedUrl.searchParams.get(LOCALE_QUERY_KEY),
  })
  const legalKind = legalKindByPath[parsedUrl.pathname]
  const metadata = legalKind
    ? getLegalDocument(locale, legalKind).metadata
    : getLandingContent(locale).metadata
  const origin = options.origin ?? publicConfig.siteOrigin ?? previewOrigin
  const router = createAppRouter(url)

  await router.load()

  return {
    appHtml: renderToString(<RouterProvider router={router} />),
    headHtml: renderToStaticMarkup(
      <LocaleSeo
        locale={locale}
        metadata={metadata}
        origin={origin}
        path={parsedUrl.pathname}
      />,
    ),
    htmlAttrs: `lang="${htmlLang(locale)}"`,
  }
}
