import { RouterProvider } from "@tanstack/react-router"
import { renderToStaticMarkup, renderToString } from "react-dom/server"

import { createAppRouter } from "@/app/createAppRouter"
import { LocaleSeo } from "@/components/seo/LocaleSeo"
import { publicConfig } from "@/config/publicConfig"
import { getLandingContent, type Locale } from "@/content"

export type PublicRoute = "/pt" | "/en"

export type RenderedPage = {
  appHtml: string
  headHtml: string
  htmlAttrs: string
}

type RenderOptions = {
  origin?: string
}

const previewOrigin = "http://localhost:4173"

export async function render(
  url: PublicRoute,
  options: RenderOptions = {},
): Promise<RenderedPage> {
  const router = createAppRouter(url)
  const locale = url.slice(1) as Locale
  const content = getLandingContent(locale)
  const origin = options.origin ?? publicConfig.siteOrigin ?? previewOrigin

  await router.load()

  return {
    appHtml: renderToString(<RouterProvider router={router} />),
    headHtml: renderToStaticMarkup(
      <LocaleSeo locale={locale} metadata={content.metadata} origin={origin} />,
    ),
    htmlAttrs: url === "/pt" ? 'lang="pt-BR"' : 'lang="en"',
  }
}
