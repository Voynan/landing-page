import { describe, expect, it } from "vitest"

import { createAppRouter } from "@/app/createAppRouter"
import { render } from "@/entry-server"
import { resolveRootLocale } from "@/utils/rootLocale"

describe("public locale routes", () => {
  it.each([
    ["/pt", 'lang="pt-BR"', "https://voynan.com/pt", "en"],
    ["/en", 'lang="en"', "https://voynan.com/en", "pt-BR"],
  ] as const)(
    "renders %s as crawlable HTML",
    async (url, htmlAttrs, canonical, alternateLocale) => {
      const result = await render(url, { origin: "https://voynan.com" })

      expect(result.appHtml).toContain("<main")
      expect(result.htmlAttrs).toBe(htmlAttrs)
      expect(result.headHtml).toContain(`rel="canonical" href="${canonical}"`)
      expect(result.headHtml).toContain(`hrefLang="${alternateLocale}"`)
    },
  )

  it("defaults to Portuguese without overwriting an explicit preference", () => {
    expect(resolveRootLocale(null)).toBe("pt")
    expect(resolveRootLocale("pt")).toBe("pt")
    expect(resolveRootLocale("en")).toBe("en")
    expect(resolveRootLocale("fr")).toBe("pt")
  })

  it("redirects the server-side root request to the default locale", async () => {
    const router = createAppRouter("/")

    await router.load()

    expect(router._serverResult?.type).toBe("redirect")

    if (router._serverResult?.type !== "redirect") {
      throw new Error("Expected the root route to return a redirect response.")
    }

    expect(router._serverResult.redirect.headers.get("location")).toBe("/pt")
  })
})
