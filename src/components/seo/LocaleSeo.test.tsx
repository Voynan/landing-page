import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { LocaleSeo } from "@/components/seo/LocaleSeo"
import { getLandingContent } from "@/content"

describe("locale SEO", () => {
  it.each([
    ["pt", "https://voynan.com/?lang=pt"],
    ["en", "https://voynan.com/"],
  ] as const)(
    "points the %s canonical at its own variant",
    (locale, canonical) => {
      const head = renderToStaticMarkup(
        <LocaleSeo
          locale={locale}
          metadata={getLandingContent(locale).metadata}
          origin="https://voynan.com"
        />,
      ).toLowerCase()

      expect(head).toContain(`rel="canonical" href="${canonical}"`)
      expect(head).toContain(`property="og:url" content="${canonical}"`)
      expect(head).toContain('property="og:title"')
      expect(head).toContain('property="og:description"')
    },
  )

  it("cross-links both variants and names an x-default", () => {
    const head = renderToStaticMarkup(
      <LocaleSeo
        locale="en"
        metadata={getLandingContent("en").metadata}
        origin="https://voynan.com"
        path="/privacy"
      />,
    ).toLowerCase()

    expect(head).toContain('hreflang="en" href="https://voynan.com/privacy"')
    expect(head).toContain(
      'hreflang="pt-br" href="https://voynan.com/privacy?lang=pt"',
    )
    expect(head).toContain(
      'hreflang="x-default" href="https://voynan.com/privacy"',
    )
  })

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
