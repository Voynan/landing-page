import { describe, expect, it } from "vitest"

import {
  createAnalytics,
  createClarityRuntime,
  type AllowedEvent,
  type AnalyticsCapture,
  type ClarityClient,
  type ClarityConsentOptions,
} from "@/lib/analytics"

type ClarityCall =
  | ["init", string]
  | ["event", string]
  | ["consentV2", ClarityConsentOptions]

const projectId = "yydi4j8nmh"
const cookieless = { ad_Storage: "denied", analytics_Storage: "denied" }
const withCookies = { ad_Storage: "denied", analytics_Storage: "granted" }

function recordingCapture(records: string[]) {
  return ((eventName) => {
    records.push(eventName)
  }) satisfies AnalyticsCapture
}

function fakeClarity(calls: ClarityCall[]): ClarityClient {
  return {
    init: (id) => {
      calls.push(["init", id])
    },
    event: (eventName) => {
      calls.push(["event", eventName])
    },
    consentV2: (options) => {
      calls.push(["consentV2", options])
    },
  }
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe("createAnalytics", () => {
  it("sends every approved event to Clarity under its documented name", () => {
    const records: string[] = []
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

    expect(events.map((event) => analytics.track(event))).toEqual(
      events.map(() => true),
    )
    expect(records).toEqual([
      "hero_product_click",
      "hero_contact_click",
      "product_view:cryptovault",
      "product_click:bullledger",
      "aegis_github_click",
      "aegis_docs_click",
      "contact_start",
      "contact_submit_success",
      "contact_submit_error:timeout",
      "email_copy",
      "language_change:pt-en",
    ])
  })

  it.each(["contactName", "email", "message", "clipboard", "content"])(
    "rejects the sensitive or unapproved property %s at runtime",
    (property) => {
      const records: string[] = []
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
    const records: string[] = []
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
      "product_view:cryptovault",
      "product_view:constrully",
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
    await flushPromises()
  })

  it("does not capture when public analytics configuration is disabled", () => {
    const records: string[] = []
    const analytics = createAnalytics({
      capture: recordingCapture(records),
      enabled: false,
    })

    expect(analytics.track({ name: "hero_product_click" })).toBe(false)
    expect(records).toEqual([])
  })
})

describe("createClarityRuntime", () => {
  it("initializes Clarity once, with ad storage denied and the stored choice", async () => {
    const calls: ClarityCall[] = []
    let loads = 0
    const runtime = createClarityRuntime({
      projectId,
      loadClient: async () => {
        loads += 1
        return fakeClarity(calls)
      },
    })

    runtime.start(true)
    runtime.start(true)
    await flushPromises()

    expect(loads).toBe(1)
    expect(calls).toEqual([
      ["init", projectId],
      ["consentV2", withCookies],
    ])
  })

  it("starts cookieless when the visitor has not accepted", async () => {
    const calls: ClarityCall[] = []
    const runtime = createClarityRuntime({
      projectId,
      loadClient: async () => fakeClarity(calls),
    })

    runtime.start(false)
    await flushPromises()

    expect(calls).toEqual([
      ["init", projectId],
      ["consentV2", cookieless],
    ])
  })

  it("forwards later decisions without ever granting ad storage", async () => {
    const calls: ClarityCall[] = []
    const runtime = createClarityRuntime({
      projectId,
      loadClient: async () => fakeClarity(calls),
    })

    runtime.start(true)
    runtime.setConsent(false)
    runtime.setConsent(true)
    await flushPromises()

    expect(calls.filter(([method]) => method === "consentV2")).toEqual([
      ["consentV2", withCookies],
      ["consentV2", cookieless],
      ["consentV2", withCookies],
    ])
  })

  it("delivers events tracked before Clarity has loaded", async () => {
    const calls: ClarityCall[] = []
    const runtime = createClarityRuntime({
      projectId,
      loadClient: async () => fakeClarity(calls),
    })

    void runtime.capture("product_view:cryptovault")
    runtime.start(false)
    await flushPromises()

    expect(calls).toEqual([
      ["init", projectId],
      ["consentV2", cookieless],
      ["event", "product_view:cryptovault"],
    ])
  })

  it("loads nothing without a project ID", async () => {
    let loads = 0
    const runtime = createClarityRuntime({
      projectId: undefined,
      loadClient: async () => {
        loads += 1
        return fakeClarity([])
      },
    })

    runtime.start(true)
    runtime.setConsent(true)
    await flushPromises()

    expect(loads).toBe(0)
  })

  it("absorbs a Clarity script that fails to load", async () => {
    const runtime = createClarityRuntime({
      projectId,
      loadClient: async () => {
        throw new Error("blocked by an extension")
      },
    })

    expect(() => runtime.start(true)).not.toThrow()
    expect(() => runtime.setConsent(false)).not.toThrow()
    await flushPromises()
  })
})
