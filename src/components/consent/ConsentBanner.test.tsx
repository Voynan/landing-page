// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { useAnalyticsConsent } from "@/app/analyticsConsentContext"
import { ConsentBanner } from "@/components/consent/ConsentBanner"
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analyticsConsent"

function Reopener() {
  const { reopen } = useAnalyticsConsent()

  return (
    <button type="button" onClick={(event) => reopen(event.currentTarget)}>
      Reopen
    </button>
  )
}

function renderBanner(analyticsEnabled = true) {
  const runtime = { setConsent: vi.fn() }

  render(
    <AppProviders
      initialLocale="en"
      analyticsEnabled={analyticsEnabled}
      analyticsRuntime={runtime}
    >
      <ConsentBanner />
      <Reopener />
    </AppProviders>,
  )

  return runtime
}

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, "", "/")
})
afterEach(cleanup)

describe("ConsentBanner", () => {
  it("offers equal accept and decline choices next to the privacy policy", () => {
    renderBanner()

    const banner = screen.getByRole("region", { name: "Analytics cookies" })
    const accept = within(banner).getByRole("button", {
      name: "Accept cookies",
    })
    const decline = within(banner).getByRole("button", { name: "Decline" })

    expect(banner).toHaveTextContent("Microsoft Clarity")
    expect(accept.dataset.variant).toBe(decline.dataset.variant)
    expect(accept.dataset.size).toBe(decline.dataset.size)
    expect(
      within(banner).getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy")
  })

  it("speaks Portuguese and links to the Portuguese policy", async () => {
    window.history.replaceState(null, "", "/?lang=pt")
    renderBanner()

    // LocaleProvider switches to the URL's locale after hydration.
    const banner = await screen.findByRole("region", {
      name: "Cookies de analytics",
    })

    expect(
      within(banner).getByRole("button", { name: "Aceitar cookies" }),
    ).toBeVisible()
    expect(
      within(banner).getByRole("button", { name: "Recusar" }),
    ).toBeVisible()
    expect(
      within(banner).getByRole("link", { name: "Política de privacidade" }),
    ).toHaveAttribute("href", "/privacy?lang=pt")
  })

  it("closes once the visitor accepts and passes the choice to Clarity", async () => {
    const user = userEvent.setup()
    const runtime = renderBanner()

    await user.click(screen.getByRole("button", { name: "Accept cookies" }))

    expect(
      screen.queryByRole("region", { name: "Analytics cookies" }),
    ).not.toBeInTheDocument()
    expect(runtime.setConsent).toHaveBeenCalledWith(true)
  })

  it("takes focus when reopened so keyboard users land on the choice", async () => {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        choice: "denied",
        decidedAt: new Date().toISOString(),
      }),
    )
    const user = userEvent.setup()
    renderBanner()

    await user.click(screen.getByRole("button", { name: "Reopen" }))

    expect(
      screen.getByRole("region", { name: "Analytics cookies" }),
    ).toHaveFocus()
  })

  it("renders nothing when analytics is not configured", () => {
    renderBanner(false)

    expect(
      screen.queryByRole("region", { name: "Analytics cookies" }),
    ).not.toBeInTheDocument()
  })
})
