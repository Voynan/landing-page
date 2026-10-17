import { describe, expect, it } from "vitest"

import { assertReleaseConfig, readPublicConfig } from "@/config/publicConfig"

describe("public configuration", () => {
  it("rejects a release that exposes the internal design system", () => {
    expect(() =>
      assertReleaseConfig({
        siteOrigin: "https://voynan.com",
        contactEndpoint: "https://api.voynan.com/contact",
        antispamSiteKey: "public-site-key",
        enableDesignSystem: "true",
      }),
    ).toThrow("VITE_ENABLE_DESIGN_SYSTEM must be false for release")
  })

  it("lists every missing release-critical setting", () => {
    expect(() => assertReleaseConfig({ enableDesignSystem: "false" })).toThrow(
      /VITE_SITE_ORIGIN[\s\S]*VITE_CONTACT_ENDPOINT[\s\S]*VITE_ANTISPAM_SITE_KEY/,
    )
  })

  it("allows analytics to remain disabled", () => {
    expect(() =>
      assertReleaseConfig({
        siteOrigin: "https://voynan.com",
        contactEndpoint: "https://api.voynan.com/contact",
        antispamSiteKey: "public-site-key",
        enableDesignSystem: false,
      }),
    ).not.toThrow()
  })

  it("normalizes only the allowlisted Vite keys", () => {
    expect(
      readPublicConfig({
        VITE_SITE_ORIGIN: "https://voynan.com/",
        VITE_ENABLE_DESIGN_SYSTEM: "false",
        PRIVATE_TOKEN: "must-not-leak",
      }),
    ).toEqual({
      siteOrigin: "https://voynan.com",
      contactEndpoint: undefined,
      antispamSiteKey: undefined,
      clarityProjectId: undefined,
      loadsClarity: false,
      enableDesignSystem: false,
      isDevelopment: false,
      analyticsEnabled: false,
    })
  })

  it("enables analytics only from the Clarity project ID", () => {
    expect(
      readPublicConfig({ VITE_CLARITY_PROJECT_ID: " yydi4j8nmh " }),
    ).toMatchObject({ clarityProjectId: "yydi4j8nmh", analyticsEnabled: true })

    const retired = readPublicConfig({
      VITE_POSTHOG_KEY: "phc_retired",
      VITE_POSTHOG_HOST: "https://us.i.posthog.com",
    })

    expect(retired.analyticsEnabled).toBe(false)
    expect(retired).not.toHaveProperty("posthogKey")
    expect(retired).not.toHaveProperty("posthogHost")
  })

  it("shows the consent flow on the development server without ever loading Clarity there", () => {
    const config = readPublicConfig({
      VITE_CLARITY_PROJECT_ID: "yydi4j8nmh",
      DEV: true,
    })

    expect(config.analyticsEnabled).toBe(true)
    expect(config.loadsClarity).toBe(false)
  })

  it("loads Clarity from production builds that carry the project ID", () => {
    expect(
      readPublicConfig({ VITE_CLARITY_PROJECT_ID: "yydi4j8nmh" }).loadsClarity,
    ).toBe(true)
  })

  it("normalizes the Vite development mode for internal route gates", () => {
    expect(readPublicConfig({ DEV: true }).isDevelopment).toBe(true)
  })
})
