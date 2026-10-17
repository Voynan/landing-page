// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { useAnalyticsConsent } from "@/app/analyticsConsentContext"
import { ConsentBanner } from "@/components/consent/ConsentBanner"
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analyticsConsent"
import englishCommon from "@/i18n/locales/en/common.json"
import portugueseCommon from "@/i18n/locales/pt/common.json"

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
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function stubResizeObserver(entry: Partial<ResizeObserverEntry>) {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() {
        this.callback([entry as ResizeObserverEntry], this as never)
      }
      disconnect() {}
    },
  )
}

const bannerHeight = () =>
  document.documentElement.style.getPropertyValue("--consent-banner-height")

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

  it("promises that nothing loads before the visitor accepts", () => {
    renderBanner()

    const banner = screen.getByRole("region", { name: "Analytics cookies" })

    expect(banner).toHaveTextContent("Nothing loads before that.")
    expect(banner).toHaveTextContent("records your session")
    expect(banner).not.toHaveTextContent(/runs without cookies/i)
  })

  it.each([
    ["English", englishCommon.consent.body],
    ["Portuguese", portugueseCommon.consent.body],
  ])(
    "keeps the %s explanation short enough to leave a small phone screen readable",
    (_locale, body) => {
      expect(body.length).toBeLessThanOrEqual(180)
    },
  )

  it("speaks Portuguese and links to the Portuguese policy", async () => {
    window.history.replaceState(null, "", "/?lang=pt")
    renderBanner()

    // LocaleProvider switches to the URL's locale after hydration.
    const banner = await screen.findByRole("region", {
      name: portugueseCommon.consent.title,
    })

    expect(
      within(banner).getByRole("button", {
        name: portugueseCommon.consent.accept,
      }),
    ).toBeVisible()
    expect(
      within(banner).getByRole("button", {
        name: portugueseCommon.consent.decline,
      }),
    ).toBeVisible()
    expect(
      within(banner).getByRole("link", {
        name: portugueseCommon.consent.privacyLink,
      }),
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

  it("reserves the banner's measured height at the end of the page until a choice is made", async () => {
    stubResizeObserver({
      borderBoxSize: [{ blockSize: 277.4, inlineSize: 390 }],
    } as Partial<ResizeObserverEntry>)
    const user = userEvent.setup()
    renderBanner()

    expect(bannerHeight()).toBe("278px")

    await user.click(screen.getByRole("button", { name: "Accept cookies" }))

    expect(bannerHeight()).toBe("")
  })

  it("still reserves the banner height in browsers that report no border box size", () => {
    stubResizeObserver({})
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(355)

    expect(() => renderBanner()).not.toThrow()
    expect(bannerHeight()).toBe("355px")
  })

  it("renders nothing when analytics is not configured", () => {
    renderBanner(false)

    expect(
      screen.queryByRole("region", { name: "Analytics cookies" }),
    ).not.toBeInTheDocument()
  })
})
