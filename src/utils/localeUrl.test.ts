import { describe, expect, it } from "vitest"

import { legalPaths } from "@/content/legal"
import { buildLocaleUrl } from "@/utils/localeUrl"

describe("locale URLs", () => {
  it("builds a locale-free English URL with a stable section fragment", () => {
    expect(buildLocaleUrl("https://voynan.com", "en", "products")).toBe(
      "https://voynan.com/#products",
    )
  })

  it("marks the Portuguese variant with the language query", () => {
    expect(buildLocaleUrl("https://voynan.com", "pt", "products")).toBe(
      "https://voynan.com/?lang=pt#products",
    )
  })

  it("normalizes an origin with a trailing path", () => {
    expect(buildLocaleUrl("https://voynan.com/internal/", "pt")).toBe(
      "https://voynan.com/?lang=pt",
    )
  })

  it("rejects malformed origins", () => {
    expect(() => buildLocaleUrl("voynan.com", "pt")).toThrow(
      /valid absolute origin/i,
    )
  })
})

describe("legal paths", () => {
  it("exposes one English path per document, independent of locale", () => {
    expect(legalPaths).toEqual({ privacy: "/privacy", terms: "/terms" })
  })
})
