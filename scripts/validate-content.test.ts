import { describe, expect, it } from "vitest"

import { getLandingContent } from "../src/content/index.js"
import { validateRelease } from "./validate-content.js"

describe("release content validator", () => {
  // The published content is fully approved, so a locale failure has to be
  // reintroduced here for the aggregation across sections to be observable.
  const withPendingMetadata = (locale: "pt" | "en") => {
    const content = getLandingContent(locale)

    return {
      ...content,
      metadata: { ...content.metadata, approval: "received" as const },
    }
  }

  it("aggregates configuration and both locale failures", () => {
    expect(() =>
      validateRelease({
        config: { enableDesignSystem: "true" },
        contentByLocale: {
          pt: withPendingMetadata("pt"),
          en: withPendingMetadata("en"),
        },
      }),
    ).toThrow(
      /Configuration[\s\S]*VITE_ENABLE_DESIGN_SYSTEM[\s\S]*Português \(pt\)[\s\S]*English \(en\)/,
    )
  })

  it("passes for the published content once the configuration is release-ready", () => {
    expect(() =>
      validateRelease({
        config: {
          siteOrigin: "https://voynan.com",
          contactEndpoint: "https://contact.example/messages",
          antispamSiteKey: "site-key",
          enableDesignSystem: "false",
        },
        contentByLocale: {
          pt: getLandingContent("pt"),
          en: getLandingContent("en"),
        },
      }),
    ).not.toThrow()
  })
})
