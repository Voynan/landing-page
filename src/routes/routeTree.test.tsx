import { RouterProvider } from "@tanstack/react-router"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { createAppRouter } from "@/app/createAppRouter"
import { render } from "@/entry-server"

describe("public routes", () => {
  it.each([
    ["/", 'lang="en"', "https://voynan.com/"],
    ["/?lang=pt", 'lang="pt-BR"', "https://voynan.com/?lang=pt"],
    ["/privacy", 'lang="en"', "https://voynan.com/privacy"],
    ["/privacy?lang=pt", 'lang="pt-BR"', "https://voynan.com/privacy?lang=pt"],
    ["/terms", 'lang="en"', "https://voynan.com/terms"],
    ["/terms?lang=pt", 'lang="pt-BR"', "https://voynan.com/terms?lang=pt"],
  ] as const)(
    "renders %s as crawlable HTML",
    async (url, htmlAttrs, canonical) => {
      const result = await render(url, { origin: "https://voynan.com" })

      expect(result.appHtml).toContain("<main")
      expect(result.htmlAttrs).toBe(htmlAttrs)
      expect(result.headHtml).toContain(`rel="canonical" href="${canonical}"`)
      expect(result.headHtml).toContain('hrefLang="x-default"')
    },
  )

  it.each([
    ["/privacy", "Privacy policy", "Your rights"],
    ["/privacy?lang=pt", "Política de privacidade", "Seus direitos"],
    ["/terms", "Terms of use", "Products and services"],
    ["/terms?lang=pt", "Termos de uso", "Produtos e serviços"],
  ] as const)(
    "renders the legal document at %s",
    async (url, title, section) => {
      const result = await render(url, { origin: "https://voynan.com" })

      expect(result.appHtml).toContain(title)
      expect(result.appHtml).toContain(section)
    },
  )

  it("serves English at the root without a redirect", async () => {
    const router = createAppRouter("/")

    await router.load()

    expect(router._serverResult?.type).not.toBe("redirect")
  })

  it.each([
    "/pt",
    "/en",
    "/pt/privacidade",
    "/en/privacy",
    "/pt/termos",
    "/en/terms",
  ])("no longer serves the retired path %s", async (path) => {
    const router = createAppRouter(path)

    await router.load()

    expect(renderToString(<RouterProvider router={router} />)).toContain(
      "Page not found",
    )
  })
})
