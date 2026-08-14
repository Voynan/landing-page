import { describe, expect, it } from "vitest"

import { getLandingContent } from "../src/content/index.js"
import { validateRelease } from "./validate-content.js"

describe("release content validator", () => {
  it("aggregates configuration and both locale failures", () => {
    expect(() =>
      validateRelease({
        config: { enableDesignSystem: "true" },
        contentByLocale: {
          pt: getLandingContent("pt"),
          en: getLandingContent("en"),
        },
      }),
    ).toThrow(
      /Configuration[\s\S]*VITE_ENABLE_DESIGN_SYSTEM[\s\S]*Português \(pt\)[\s\S]*English \(en\)/,
    )
  })
})
