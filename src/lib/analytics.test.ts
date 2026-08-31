import { describe, expect, it } from "vitest"

import {
  createAnalytics,
  type AllowedEvent,
  type AnalyticsCapture,
} from "@/lib/analytics"

function recordingCapture(records: Array<[string, Record<string, unknown>]>) {
  return ((name, properties) => {
    records.push([name, properties])
  }) satisfies AnalyticsCapture
}

describe("createAnalytics", () => {
  it("captures only the approved event names and payload fields", () => {
    const records: Array<[string, Record<string, unknown>]> = []
    const analytics = createAnalytics({
      capture: recordingCapture(records),
      enabled: true,
    })
    const events = [
      { name: "hero_product_click" },
      { name: "hero_contact_click" },
      { name: "product_view", productId: "cryptovault" },
      { name: "product_click", productId: "bullledger" },
      { name: "aegis_github_click" },
      { name: "aegis_docs_click" },
      { name: "contact_start" },
      { name: "contact_submit_success" },
      { name: "contact_submit_error", reason: "timeout" },
      { name: "email_copy" },
      { name: "language_change", from: "pt", to: "en" },
    ] satisfies readonly AllowedEvent[]

    expect(events.map((event) => analytics.track(event))).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ])
    expect(records).toEqual([
      ["hero_product_click", {}],
      ["hero_contact_click", {}],
      ["product_view", { productId: "cryptovault" }],
      ["product_click", { productId: "bullledger" }],
      ["aegis_github_click", {}],
      ["aegis_docs_click", {}],
      ["contact_start", {}],
      ["contact_submit_success", {}],
      ["contact_submit_error", { reason: "timeout" }],
      ["email_copy", {}],
      ["language_change", { from: "pt", to: "en" }],
    ])
  })

  it.each(["contactName", "email", "message", "clipboard", "content"])(
    "rejects the sensitive or unapproved property %s at runtime",
    (property) => {
      const records: Array<[string, Record<string, unknown>]> = []
      const analytics = createAnalytics({
        capture: recordingCapture(records),
        enabled: true,
      })

      expect(
        analytics.track({
          name: "contact_start",
          [property]: "must-not-leave-the-browser",
        } as never),
      ).toBe(false)
      expect(records).toEqual([])
    },
  )

  it("deduplicates product views per product for the page visit", () => {
    const records: Array<[string, Record<string, unknown>]> = []
    const analytics = createAnalytics({
      capture: recordingCapture(records),
      enabled: true,
    })

    expect(
      analytics.track({ name: "product_view", productId: "cryptovault" }),
    ).toBe(true)
    expect(
      analytics.track({ name: "product_view", productId: "cryptovault" }),
    ).toBe(false)
    expect(
      analytics.track({ name: "product_view", productId: "constrully" }),
    ).toBe(true)
    expect(records).toEqual([
      ["product_view", { productId: "cryptovault" }],
      ["product_view", { productId: "constrully" }],
    ])
  })

  it("keeps interaction outcomes silent when analytics is blocked", () => {
    const analytics = createAnalytics({
      capture: () => {
        throw new Error("blocked")
      },
      enabled: true,
    })

    expect(() => analytics.track({ name: "hero_contact_click" })).not.toThrow()
    expect(analytics.track({ name: "hero_contact_click" })).toBe(false)
  })

  it("absorbs an asynchronously rejected analytics request", async () => {
    const analytics = createAnalytics({
      capture: async () => {
        throw new Error("blocked asynchronously")
      },
      enabled: true,
    })

    expect(analytics.track({ name: "hero_product_click" })).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it("does not capture when public analytics configuration is disabled", () => {
    const records: Array<[string, Record<string, unknown>]> = []
    const analytics = createAnalytics({
      capture: recordingCapture(records),
      enabled: false,
    })

    expect(analytics.track({ name: "hero_product_click" })).toBe(false)
    expect(records).toEqual([])
  })
})
