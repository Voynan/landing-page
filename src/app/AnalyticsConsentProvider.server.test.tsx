import { renderToString } from "react-dom/server"
import { expect, it, vi } from "vitest"

import { AnalyticsConsentProvider } from "@/app/AnalyticsConsentProvider"
import { useAnalyticsConsent } from "@/app/analyticsConsentContext"

function BannerState() {
  const { isBannerOpen } = useAnalyticsConsent()

  return <p>{isBannerOpen ? "banner-open" : "banner-closed"}</p>
}

it("keeps the banner out of the prerendered HTML even when analytics is configured", () => {
  const runtime = { start: vi.fn(), setConsent: vi.fn() }

  const html = renderToString(
    <AnalyticsConsentProvider enabled runtime={runtime}>
      <BannerState />
    </AnalyticsConsentProvider>,
  )

  expect(html).toContain("banner-closed")
  expect(runtime.start).not.toHaveBeenCalled()
})
