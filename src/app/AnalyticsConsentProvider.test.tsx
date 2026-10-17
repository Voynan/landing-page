// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AnalyticsConsentProvider } from "@/app/AnalyticsConsentProvider"
import { useAnalyticsConsent } from "@/app/analyticsConsentContext"
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analyticsConsent"

const dayInMs = 24 * 60 * 60 * 1000

function ConsentProbe() {
  const { status, isBannerOpen, accept, decline, reopen } =
    useAnalyticsConsent()

  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="banner">{isBannerOpen ? "open" : "closed"}</p>
      <button type="button" onClick={accept}>
        Accept
      </button>
      <button type="button" onClick={decline}>
        Decline
      </button>
      <button type="button" onClick={(event) => reopen(event.currentTarget)}>
        Cookie preferences
      </button>
    </div>
  )
}

function renderConsent(enabled = true) {
  const runtime = { setConsent: vi.fn() }

  render(
    <AnalyticsConsentProvider enabled={enabled} runtime={runtime}>
      <ConsentProbe />
    </AnalyticsConsentProvider>,
  )

  return runtime
}

function storeChoice(choice: "granted" | "denied", decidedAt: Date) {
  window.localStorage.setItem(
    ANALYTICS_CONSENT_STORAGE_KEY,
    JSON.stringify({ version: 1, choice, decidedAt: decidedAt.toISOString() }),
  )
}

beforeEach(() => window.localStorage.clear())
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("AnalyticsConsentProvider", () => {
  it("opens the banner for a new visitor without loading Clarity", () => {
    const runtime = renderConsent()

    expect(screen.getByTestId("banner")).toHaveTextContent("open")
    expect(screen.getByTestId("status")).toHaveTextContent("undecided")
    expect(runtime.setConsent).not.toHaveBeenCalled()
  })

  it("remembers acceptance, grants analytics cookies, and closes the banner", async () => {
    const user = userEvent.setup()
    const runtime = renderConsent()

    await user.click(screen.getByRole("button", { name: "Accept" }))

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(screen.getByTestId("status")).toHaveTextContent("granted")
    expect(runtime.setConsent).toHaveBeenCalledWith(true)
    expect(
      JSON.parse(
        window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) ?? "{}",
      ),
    ).toMatchObject({ version: 1, choice: "granted" })
  })

  it("loads Clarity for a returning visitor who accepted, without asking again", () => {
    storeChoice("granted", new Date(Date.now() - 30 * dayInMs))

    const runtime = renderConsent()

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(runtime.setConsent).toHaveBeenCalledWith(true)
  })

  it("keeps Clarity unloaded for a returning visitor who declined", () => {
    storeChoice("denied", new Date(Date.now() - 30 * dayInMs))

    const runtime = renderConsent()

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(runtime.setConsent).not.toHaveBeenCalled()
  })

  it("asks again without loading Clarity when the stored choice has expired", () => {
    storeChoice("granted", new Date(Date.now() - 400 * dayInMs))

    const runtime = renderConsent()

    expect(screen.getByTestId("banner")).toHaveTextContent("open")
    expect(runtime.setConsent).not.toHaveBeenCalled()
  })

  it("reopens on request and returns focus to the control that asked", async () => {
    const user = userEvent.setup()
    storeChoice("granted", new Date(Date.now() - dayInMs))
    const runtime = renderConsent()
    const trigger = screen.getByRole("button", { name: "Cookie preferences" })

    await user.click(trigger)
    expect(screen.getByTestId("banner")).toHaveTextContent("open")

    await user.click(screen.getByRole("button", { name: "Decline" }))

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(screen.getByTestId("status")).toHaveTextContent("denied")
    expect(runtime.setConsent).toHaveBeenLastCalledWith(false)
    expect(trigger).toHaveFocus()
  })

  it("honours the choice for the page view when storage is blocked", async () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    const user = userEvent.setup()
    const runtime = renderConsent()

    await user.click(screen.getByRole("button", { name: "Accept" }))

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(runtime.setConsent).toHaveBeenCalledWith(true)
  })

  it("stays inert without a Clarity project ID", async () => {
    const user = userEvent.setup()
    const runtime = renderConsent(false)

    await user.click(screen.getByRole("button", { name: "Cookie preferences" }))

    expect(screen.getByTestId("banner")).toHaveTextContent("closed")
    expect(runtime.setConsent).not.toHaveBeenCalled()
  })
})
