// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { switchLocale } from "@/hooks/useLocaleNavigation"
import { buildLocaleUrl } from "@/utils/localeUrl"
import { ROOT_LOCALE_STORAGE_KEY } from "@/utils/rootLocale"

beforeEach(() => {
  const values = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  }

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: storage,
  })
})

afterEach(() => {
  window.history.replaceState(null, "", "/")
})

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

  it("switches locale at the equivalent chapter and persists the explicit choice", () => {
    const destinations: string[] = []
    const storage = window.localStorage

    switchLocale("en", "products", {
      navigate: (destination) => destinations.push(destination),
      storage,
    })

    expect(destinations).toEqual(["/en#products"])
    expect(storage.getItem(ROOT_LOCALE_STORAGE_KEY)).toBe("en")
  })
})
