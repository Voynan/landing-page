import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { LocaleSeo } from "@/components/seo/LocaleSeo"
import { getLandingContent } from "@/content"

describe("locale SEO", () => {
  it.each([
    ["pt", "pt-BR", "en", "https://voynan.com/pt"],
    ["en", "en", "pt-BR", "https://voynan.com/en"],
  ] as const)(
    "renders canonical, reciprocal language and Open Graph tags for %s",
    (locale, ownHrefLang, alternateHrefLang, canonical) => {
      const metadata = getLandingContent(locale).metadata
      const head = renderToStaticMarkup(
        <LocaleSeo
          locale={locale}
          metadata={metadata}
          origin="https://voynan.com"
        />,
      ).toLowerCase()

      expect(head).toContain(`rel="canonical" href="${canonical}"`)
      expect(head).toContain(`hreflang="${ownHrefLang.toLowerCase()}"`)
      expect(head).toContain(`hreflang="${alternateHrefLang.toLowerCase()}"`)
      expect(head).toContain('property="og:title"')
      expect(head).toContain('property="og:description"')
      expect(head).toContain('property="og:url"')
    },
  )

  it("rejects incomplete metadata instead of rendering empty tags", () => {
    expect(() =>
      renderToStaticMarkup(
        <LocaleSeo
          locale="pt"
          metadata={{ approval: "missing" }}
          origin="https://voynan.com"
        />,
      ),
    ).toThrow(/metadata requires title, description and Open Graph copy/i)
  })
})
