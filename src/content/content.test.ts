import { describe, expect, it } from "vitest"

import {
  assertPublishableContent,
  getPublicationBlockers,
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
        aegis: {
          ...content.aegis,
          github: {
            label: content.aegis.github.label,
            approval: "reviewed",
          },
        },
      }),
    ).toThrow(/aegis\.github.*approved/i)
  })

  it("distinguishes the three released products from Constrully", () => {
    const products = getLandingContent("pt").products.items

    expect(
      products.map(({ id, name, stage }) => ({ id, name, stage })),
    ).toEqual([
      { id: "cryptovault", name: "CryptoVault", stage: "production" },
      { id: "bullledger", name: "BullLedger", stage: "production" },
      { id: "safenumber", name: "SafeNumber", stage: "production" },
      { id: "constrully", name: "Constrully", stage: "development" },
    ])
    expect(products).toHaveLength(4)
    expect(
      new Set(products.map((product) => product.capabilities.length)),
    ).toEqual(new Set([3]))
  })

  it.each([
    [
      "pt",
      "Produtos próprios",
      "3 SaaS em produção · 1 produto em desenvolvimento",
      "A experiência de operar esses produtos é a mesma que levamos para cada projeto de cliente.",
    ],
    [
      "en",
      "Our products",
      "3 SaaS products in production · 1 product in development",
      "The experience of operating these products is the same experience we bring to every client project.",
    ],
  ] as const)(
    "publishes the %s product observatory overture",
    (locale, kicker, summary, closing) => {
      const products = getLandingContent(locale).products

      expect(products.kicker).toBe(kicker)
      expect(products.title).toBeTruthy()
      expect(products.summary).toBe(summary)
      expect(products.closing).toBe(closing)
    },
  )

  it("localizes the conceptual evidence label", () => {
    expect(createI18n("pt").t("products.conceptualEvidence")).toBe(
      "Representação conceitual",
    )
    expect(createI18n("en").t("products.conceptualEvidence")).toBe(
      "Conceptual representation",
    )
  })

  it("reports all production-product blockers instead of stopping at the first", () => {
    expect(() => assertPublishableContent(getLandingContent("en"))).toThrow(
      /products\.items\.0\.destination[\s\S]*products\.items\.1\.destination[\s\S]*products\.items\.2\.destination/i,
    )
  })

  it("does not require release-only Aegis evidence during development", () => {
    const content = getLandingContent("en")
    const blockers = getPublicationBlockers({
      ...content,
      aegis: {
        ...content.aegis,
        stage: "development",
      },
    })

    expect(blockers).not.toContain(
      "aegis.documentation must be approved (currently received)",
    )
    expect(blockers).not.toContain(
      "aegis.technicalEvidence must be approved (currently missing)",
    )
  })

  it("does not require a destination or media for development-stage Constrully", () => {
    const blockers = getPublicationBlockers(getLandingContent("pt"))

    expect(blockers).not.toContain(
      "products.items.3.destination must be approved (currently missing)",
    )
    expect(blockers).not.toContain(
      "products.items.3.media must be approved (currently missing)",
    )
    expect(blockers).toContain(
      "products.items.3.claimReview must be approved (currently missing)",
    )
  })

  it.each(["pt", "en"] as const)(
    "does not report the approved %s founder profile as a publication blocker",
    (locale) => {
      expect(getPublicationBlockers(getLandingContent(locale))).not.toContain(
        "founder.profile must be approved (currently received)",
      )
    },
  )

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
