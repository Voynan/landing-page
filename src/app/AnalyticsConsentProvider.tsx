import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  AnalyticsConsentContext,
  type AnalyticsConsentContextValue,
} from "@/app/analyticsConsentContext"
import { analyticsRuntime, type AnalyticsRuntime } from "@/lib/analytics"
import {
  readConsent,
  writeConsent,
  type AnalyticsConsentChoice,
  type AnalyticsConsentStatus,
} from "@/lib/analyticsConsent"

type AnalyticsConsentProviderProps = {
  children: ReactNode
  enabled: boolean
  runtime?: AnalyticsRuntime
}

type ConsentState = {
  hydrated: boolean
  status: AnalyticsConsentStatus
}

export function AnalyticsConsentProvider({
  children,
  enabled,
  runtime = analyticsRuntime,
}: AnalyticsConsentProviderProps) {
  const [consent, setConsent] = useState<ConsentState>({
    hydrated: false,
    status: "undecided",
  })
  const [openedByRequest, setOpenedByRequest] = useState(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    const status = readConsent(new Date())

    // The choice lives only in the visitor's browser, so it is read after
    // hydration; reading it during render would make the client disagree with
    // the prerendered HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent({ hydrated: true, status })
    runtime.start(status === "granted")
  }, [enabled, runtime])

  const decide = useCallback(
    (choice: AnalyticsConsentChoice) => {
      writeConsent(choice, new Date())
      setConsent({ hydrated: true, status: choice })
      setOpenedByRequest(false)
      runtime.setConsent(choice === "granted")

      const returnFocusTo = returnFocusRef.current
      returnFocusRef.current = null
      returnFocusTo?.focus()
    },
    [runtime],
  )

  const accept = useCallback(() => decide("granted"), [decide])
  const decline = useCallback(() => decide("denied"), [decide])
  const reopen = useCallback((returnFocusTo?: HTMLElement | null) => {
    returnFocusRef.current = returnFocusTo ?? null
    setOpenedByRequest(true)
  }, [])

  const value = useMemo<AnalyticsConsentContextValue>(
    () => ({
      enabled,
      status: consent.status,
      isBannerOpen:
        enabled &&
        consent.hydrated &&
        (consent.status === "undecided" || openedByRequest),
      openedByRequest,
      accept,
      decline,
      reopen,
    }),
    [enabled, consent, openedByRequest, accept, decline, reopen],
  )

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
    </AnalyticsConsentContext.Provider>
  )
}
