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
      posthogKey: undefined,
      posthogHost: undefined,
      enableDesignSystem: false,
      isDevelopment: false,
      analyticsEnabled: false,
    })
  })

  it("normalizes the Vite development mode for internal route gates", () => {
    expect(readPublicConfig({ DEV: true }).isDevelopment).toBe(true)
  })
})
