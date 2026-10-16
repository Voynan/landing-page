import { createContext, useContext } from "react"

import type { AnalyticsConsentStatus } from "@/lib/analyticsConsent"

export type AnalyticsConsentContextValue = {
  enabled: boolean
  status: AnalyticsConsentStatus
  isBannerOpen: boolean
  openedByRequest: boolean
  accept: () => void
  decline: () => void
  reopen: (returnFocusTo?: HTMLElement | null) => void
}

const noop = () => undefined

// Outside a provider analytics is simply off, which is also the state of every
// build without a Clarity project ID.
export const AnalyticsConsentContext =
  createContext<AnalyticsConsentContextValue>({
    enabled: false,
    status: "undecided",
    isBannerOpen: false,
    openedByRequest: false,
    accept: noop,
    decline: noop,
    reopen: noop,
  })

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  return useContext(AnalyticsConsentContext)
}
