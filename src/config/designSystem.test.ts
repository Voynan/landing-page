import { describe, expect, it } from "vitest"

import { isDesignSystemEnabled } from "@/config/designSystem"

describe("design system access", () => {
  it("is enabled in development or an explicit preview", () => {
    expect(isDesignSystemEnabled({ dev: true })).toBe(true)
    expect(isDesignSystemEnabled({ dev: false, flag: "true" })).toBe(true)
  })

  it("is disabled in a release build", () => {
    expect(isDesignSystemEnabled({ dev: false, flag: "false" })).toBe(false)
    expect(isDesignSystemEnabled({ dev: false })).toBe(false)
  })
})
