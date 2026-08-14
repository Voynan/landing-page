import { describe, expect, it } from "vitest"

import {
  assertPublishableContent,
  landingContentDraftSchema,
} from "@/content/contracts"
import { getLandingContent } from "@/content"
import { createI18n } from "@/i18n"

describe("landing content contracts", () => {
  it.each(["pt", "en"] as const)(
    "validates the %s draft structure",
    (locale) => {
      expect(() =>
        landingContentDraftSchema.parse(getLandingContent(locale)),
      ).not.toThrow()
    },
  )

  it("rejects evidence that is not approved", () => {
    const content = getLandingContent("pt")

    expect(() =>
      assertPublishableContent({
        ...content,
        credibility: {
          ...content.credibility,
          metrics: [
            {
              value: "12",
              period: "2026",
              definition: "Contas ativas no período",
              source: "Relatório interno revisado",
              approval: "reviewed",
            },
            ...content.credibility.metrics.slice(1),
          ],
        },
      }),
    ).toThrow(/credibility\.metrics\.0.*approved/i)
  })

  it("keeps all three products equal in structure", () => {
    const products = getLandingContent("pt").products.items

    expect(products.map((product) => product.id)).toEqual([
      "cryptovault",
      "investfusion",
      "constrully",
    ])
    expect(products).toHaveLength(3)
    expect(
      new Set(products.map((product) => product.capabilities.length)),
    ).toEqual(new Set([3]))
  })

  it("reports all publication blockers instead of stopping at the first", () => {
    expect(() => assertPublishableContent(getLandingContent("en"))).toThrow(
      /products\.items\.0\.destination[\s\S]*products\.items\.1\.destination[\s\S]*products\.items\.2\.destination/i,
    )
  })

  it("keeps short interface strings in i18n without duplicating editorial copy", () => {
    const portuguese = createI18n("pt")
    const english = createI18n("en")

    expect(portuguese.t("nav.products")).toBe("Produtos")
    expect(english.t("nav.products")).toBe("Products")
    expect(JSON.stringify(portuguese.options.resources)).not.toContain(
      getLandingContent("pt").hero.title,
    )
  })
})
