import { describe, expect, it } from "vitest"

import {
  applyLocaleToUrl,
  htmlLang,
  localeHref,
  LOCALE_QUERY_KEY,
  LOCALE_STORAGE_KEY,
  resolveLocale,
} from "@/utils/locale"

describe("resolveLocale", () => {
  it("prefers an explicit query parameter over every other signal", () => {
    expect(
      resolveLocale({
        searchParam: "pt",
        stored: "en",
        preferredLanguages: ["en-US"],
      }),
    ).toBe("pt")
    expect(
      resolveLocale({
        searchParam: "en",
        stored: "pt",
        preferredLanguages: ["pt-BR"],
      }),
    ).toBe("en")
  })

  it("ignores an unrecognized query parameter instead of throwing", () => {
    expect(resolveLocale({ searchParam: "fr", stored: "pt" })).toBe("pt")
  })

  it("falls back to the stored preference before the browser languages", () => {
    expect(resolveLocale({ stored: "en", preferredLanguages: ["pt-BR"] })).toBe(
      "en",
    )
  })

  it("detects Portuguese from the browser languages", () => {
    expect(resolveLocale({ preferredLanguages: ["pt-BR", "en"] })).toBe("pt")
    expect(resolveLocale({ preferredLanguages: ["pt"] })).toBe("pt")
  })

  it("does not treat a language that merely starts with pt as Portuguese", () => {
    expect(resolveLocale({ preferredLanguages: ["pty"] })).toBe("en")
  })

  it("falls back to English when nothing is known", () => {
    expect(resolveLocale({})).toBe("en")
    expect(
      resolveLocale({
        searchParam: null,
        stored: null,
        preferredLanguages: [],
      }),
    ).toBe("en")
  })
})

describe("locale URLs", () => {
  it("appends the query only for Portuguese", () => {
    expect(localeHref("/privacy", "pt")).toBe("/privacy?lang=pt")
    expect(localeHref("/privacy", "en")).toBe("/privacy")
  })

  it("places the fragment after the query", () => {
    expect(localeHref("/", "pt", "products")).toBe("/?lang=pt#products")
    expect(localeHref("/", "en", "products")).toBe("/#products")
  })

  it("adds and removes the query parameter on an absolute URL", () => {
    const base = new URL("https://voynan.com/privacy#rights")

    expect(applyLocaleToUrl(base, "pt").toString()).toBe(
      "https://voynan.com/privacy?lang=pt#rights",
    )
    expect(
      applyLocaleToUrl(new URL("https://voynan.com/?lang=pt"), "en").toString(),
    ).toBe("https://voynan.com/")
  })

  it("does not mutate the URL it is given", () => {
    const base = new URL("https://voynan.com/")

    applyLocaleToUrl(base, "pt")

    expect(base.toString()).toBe("https://voynan.com/")
  })

  it("maps locales to document language tags", () => {
    expect(htmlLang("pt")).toBe("pt-BR")
    expect(htmlLang("en")).toBe("en")
  })

  it("exposes stable storage and query keys", () => {
    expect(LOCALE_STORAGE_KEY).toBe("voynan.locale")
    expect(LOCALE_QUERY_KEY).toBe("lang")
  })
})
