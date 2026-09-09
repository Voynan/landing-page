// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"

import { antispamSlotAttribute, createAntispamAdapter } from "@/lib/turnstile"

type RenderOptions = {
  sitekey: string
  callback: (token: string) => void
  "error-callback": () => void
}

function installTurnstile() {
  const captured: { options?: RenderOptions } = {}
  const api = {
    render: vi.fn((_container: HTMLElement, options: RenderOptions) => {
      captured.options = options
      return "widget-id"
    }),
    execute: vi.fn(),
    reset: vi.fn(),
  }

  Object.defineProperty(window, "turnstile", {
    configurable: true,
    value: api,
  })

  return { api, captured }
}

function renderSlot() {
  document.body.innerHTML = `<div ${antispamSlotAttribute}></div>`
}

afterEach(() => {
  document.body.innerHTML = ""
  Reflect.deleteProperty(window, "turnstile")
})

describe("createAntispamAdapter", () => {
  it("produces no adapter without a site key, which leaves the form disabled", () => {
    expect(createAntispamAdapter(undefined)).toBeUndefined()
    expect(createAntispamAdapter("")).toBeUndefined()
  })

  it("resolves the token Turnstile hands back", async () => {
    const { api, captured } = installTurnstile()
    renderSlot()

    const adapter = createAntispamAdapter("site-key")
    const pending = adapter?.()

    await vi.waitFor(() => expect(api.render).toHaveBeenCalled())
    captured.options?.callback("a-token")

    await expect(pending).resolves.toBe("a-token")
    expect(api.execute).toHaveBeenCalledWith("widget-id")
  })

  it("renders into the slot the form provides", async () => {
    const { api } = installTurnstile()
    renderSlot()

    const adapter = createAntispamAdapter("site-key")
    void adapter?.()

    await vi.waitFor(() => expect(api.render).toHaveBeenCalled())

    expect(api.render.mock.calls[0][0]).toBe(
      document.querySelector(`[${antispamSlotAttribute}]`),
    )
  })

  it("resets the widget on a second request, because a token is single-use", async () => {
    const { api, captured } = installTurnstile()
    renderSlot()

    const adapter = createAntispamAdapter("site-key")

    const first = adapter?.()
    await vi.waitFor(() => expect(api.render).toHaveBeenCalled())
    captured.options?.callback("first-token")
    await first

    const second = adapter?.()
    await vi.waitFor(() => expect(api.reset).toHaveBeenCalledWith("widget-id"))
    captured.options?.callback("second-token")

    await expect(second).resolves.toBe("second-token")
    expect(api.render).toHaveBeenCalledTimes(1)
  })

  it("rejects when Turnstile reports an error, so the form shows its failure state", async () => {
    const { api, captured } = installTurnstile()
    renderSlot()

    const adapter = createAntispamAdapter("site-key")
    const pending = adapter?.()

    await vi.waitFor(() => expect(api.render).toHaveBeenCalled())
    captured.options?.["error-callback"]()

    await expect(pending).rejects.toThrow()
  })

  it("rejects when the slot is missing rather than rendering somewhere unexpected", async () => {
    installTurnstile()

    const adapter = createAntispamAdapter("site-key")

    await expect(adapter?.()).rejects.toThrow()
  })
})
