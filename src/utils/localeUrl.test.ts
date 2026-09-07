// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

import { buildLocaleUrl } from "@/utils/localeUrl"

describe("locale URLs", () => {
  it("builds a canonical locale URL with a stable section fragment", () => {
    expect(buildLocaleUrl("https://voynan.com", "en", "products")).toBe(
      "https://voynan.com/en#products",
    )
  })

  it("normalizes an origin with a trailing path", () => {
    expect(buildLocaleUrl("https://voynan.com/internal/", "pt")).toBe(
      "https://voynan.com/pt",
    )
  })

  it("rejects malformed origins", () => {
    expect(() => buildLocaleUrl("voynan.com", "pt")).toThrow(
      /valid absolute origin/i,
    )
  })
})
