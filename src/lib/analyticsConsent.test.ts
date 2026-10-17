// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  onTestFinished,
  vi,
} from "vitest"

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
} from "@/lib/analyticsConsent"
import { blockLocalStorage } from "@/test/blockedStorage"

const decidedAt = new Date("2026-10-15T12:00:00.000Z")

beforeEach(() => window.localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe("analytics consent storage", () => {
  it("is undecided before the visitor chooses", () => {
    expect(readConsent(decidedAt)).toBe("undecided")
  })

  it.each(["granted", "denied"] as const)("remembers a %s choice", (choice) => {
    writeConsent(choice, decidedAt)

    expect(readConsent(new Date("2027-04-15T12:00:00.000Z"))).toBe(choice)
  })

  it("asks again once the choice is twelve months old", () => {
    writeConsent("granted", decidedAt)

    expect(readConsent(new Date("2027-10-15T11:59:59.000Z"))).toBe("granted")
    expect(readConsent(new Date("2027-10-15T12:00:00.000Z"))).toBe("undecided")
  })

  it.each([
    ["malformed JSON", "{granted"],
    [
      "an unknown choice",
      JSON.stringify({
        version: 1,
        choice: "maybe",
        decidedAt: decidedAt.toISOString(),
      }),
    ],
    [
      "a previous format version",
      JSON.stringify({
        version: 0,
        choice: "granted",
        decidedAt: decidedAt.toISOString(),
      }),
    ],
    [
      "a missing decision date",
      JSON.stringify({ version: 1, choice: "granted" }),
    ],
  ])("treats %s as undecided", (_label, stored) => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, stored)

    expect(readConsent(decidedAt)).toBe("undecided")
  })

  it("stays usable when storage is blocked", () => {
    onTestFinished(blockLocalStorage())

    expect(() => writeConsent("granted", decidedAt)).not.toThrow()
    expect(readConsent(decidedAt)).toBe("undecided")
  })
})
