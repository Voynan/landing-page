import { describe, expect, it } from "vitest"

import {
  assertPublishableContent,
  getPublicationBlockers,
  landingContentDraftSchema,
} from "@/content/contracts"
import { getLandingContent } from "@/content"
import { createI18n } from "@/i18n"

describe("landing content contracts", () => {
  // products.items is a fixed three-element tuple, so fixtures rebuild it
  // element by element rather than mapping over it.
  const reopenClaim = <
    T extends {
      claimReview: { text: string; category: "legal" | "financial" | "tax" }
    },
  >(
    item: T,
  ) => ({
    ...item,
    claimReview: {
      text: item.claimReview.text,
      category: item.claimReview.category,
      approval: "missing" as const,
    },
  })

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

  it("distinguishes the two released products from Constrully", () => {
    const products = getLandingContent("pt").products.items

    expect(
      products.map(({ id, name, stage }) => ({ id, name, stage })),
    ).toEqual([
      { id: "cryptovault", name: "CryptoVault", stage: "production" },
      { id: "bullledger", name: "BullLedger", stage: "production" },
      { id: "constrully", name: "Constrully", stage: "development" },
    ])
    expect(products).toHaveLength(3)
    expect(
      new Set(products.map((product) => product.capabilities.length)),
    ).toEqual(new Set([3]))
  })

  it.each([
    [
      "pt",
      "Produtos próprios",
      "2 SaaS em produção · 1 produto em desenvolvimento",
      "A experiência de operar esses produtos é a mesma que levamos para cada projeto de cliente.",
    ],
    [
      "en",
      "Our products",
      "2 SaaS products in production · 1 product in development",
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

  it("localizes the coming-soon label", () => {
    expect(createI18n("pt").t("products.comingSoon")).toBe("Em breve")
    expect(createI18n("en").t("products.comingSoon")).toBe("Coming soon")
  })

  it("provides every product media caption through i18n, not the content draft", () => {
    expect(createI18n("pt").t("products.mediaCaption.cryptovault")).toBe(
      "Página inicial do produto",
    )
    expect(createI18n("en").t("products.mediaCaption.cryptovault")).toBe(
      "Product home page",
    )
    expect(createI18n("pt").t("products.mediaCaption.bullledger")).toBe(
      "Dashboard inicial de exemplo",
    )
    expect(createI18n("en").t("products.mediaCaption.bullledger")).toBe(
      "Sample starting dashboard",
    )
    expect(JSON.stringify(getLandingContent("pt"))).not.toContain(
      "Página inicial do produto",
    )
  })

  it("reports all production-product blockers instead of stopping at the first", () => {
    // The published content is fully approved, so the aggregation behaviour is
    // exercised against a fixture that reopens the first two claim reviews.
    const content = getLandingContent("en")
    const [cryptovault, bullledger, constrully] = content.products.items

    expect(() =>
      assertPublishableContent({
        ...content,
        products: {
          ...content.products,
          items: [
            reopenClaim(cryptovault),
            reopenClaim(bullledger),
            constrully,
          ],
        },
      }),
    ).toThrow(
      /products\.items\.0\.claimReview[\s\S]*products\.items\.1\.claimReview/i,
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
    const content = getLandingContent("pt")
    const [cryptovault, bullledger, constrully] = content.products.items
    const blockers = getPublicationBlockers({
      ...content,
      products: {
        ...content.products,
        items: [cryptovault, bullledger, reopenClaim(constrully)],
      },
    })

    expect(blockers).not.toContain(
      "products.items.2.destination must be approved (currently missing)",
    )
    expect(blockers).not.toContain(
      "products.items.2.media must be approved (currently missing)",
    )
    // A development stage waives the destination and the media, never the claim.
    expect(blockers).toContain(
      "products.items.2.claimReview must be approved (currently missing)",
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
  describe("approved product media crops", () => {
    const withFirstProductMedia = (media: unknown) => {
      const content = getLandingContent("en")
      const [first, second, third] = content.products.items

      return {
        ...content,
        products: {
          ...content.products,
          items: [{ ...first, media }, second, third],
        },
      }
    }

    const approvedMedia = {
      desktopSrc: "/media/cryptovault-desktop.avif",
      mobileSrc: "/media/cryptovault-mobile.avif",
      posterSrc: "/media/cryptovault-poster.webp",
      width: 1280,
      height: 800,
      alt: "CryptoVault vault view listing verified files",
      source: "Voynan product team",
      approval: "approved",
    }

    it("accepts a mobile crop that declares its own proportion", () => {
      expect(() =>
        landingContentDraftSchema.parse(
          withFirstProductMedia({
            ...approvedMedia,
            mobileWidth: 1040,
            mobileHeight: 1300,
          }),
        ),
      ).not.toThrow()
    })

    it("accepts approved media without a mobile crop proportion", () => {
      expect(() =>
        landingContentDraftSchema.parse(withFirstProductMedia(approvedMedia)),
      ).not.toThrow()
    })

    it("rejects a mobile crop width that is missing its height", () => {
      expect(() =>
        landingContentDraftSchema.parse(
          withFirstProductMedia({ ...approvedMedia, mobileWidth: 1040 }),
        ),
      ).toThrow(/mobileWidth and mobileHeight/i)
    })
  })
  it.each(["pt", "en"] as const)(
    "publishes the official %s product destinations",
    (locale) => {
      const [cryptovault, bullledger, constrully] =
        getLandingContent(locale).products.items

      expect(cryptovault.destination).toMatchObject({
        href: "https://cryptovault.rosetta-solutions.com/",
        approval: "approved",
      })
      expect(bullledger.destination).toMatchObject({
        href: "https://bull-ledger.voynan.com",
        approval: "approved",
      })
      expect(constrully.destination).toMatchObject({
        href: "https://constrully.voynan.com",
        approval: "approved",
      })
    },
  )
})
