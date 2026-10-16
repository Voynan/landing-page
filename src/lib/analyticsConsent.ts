import { z } from "zod"

export const ANALYTICS_CONSENT_STORAGE_KEY = "voynan.analytics-consent"

const consentVersion = 1
const consentLifetimeMonths = 12

export type AnalyticsConsentChoice = "granted" | "denied"
export type AnalyticsConsentStatus = AnalyticsConsentChoice | "undecided"

const storedConsentSchema = z.object({
  version: z.literal(consentVersion),
  choice: z.enum(["granted", "denied"]),
  decidedAt: z.iso.datetime(),
})

function expiresAt(decidedAt: string): Date {
  const expiry = new Date(decidedAt)
  expiry.setUTCMonth(expiry.getUTCMonth() + consentLifetimeMonths)
  return expiry
}

export function readConsent(now: Date): AnalyticsConsentStatus {
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)

    if (raw === null) return "undecided"

    const stored = storedConsentSchema.safeParse(JSON.parse(raw))

    if (!stored.success) return "undecided"

    return now < expiresAt(stored.data.decidedAt)
      ? stored.data.choice
      : "undecided"
  } catch {
    // Blocked storage and malformed JSON both mean the visitor must be asked.
    return "undecided"
  }
}

export function writeConsent(
  choice: AnalyticsConsentChoice,
  now: Date,
): void {
  try {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: consentVersion,
        choice,
        decidedAt: now.toISOString(),
      }),
    )
  } catch {
    // A blocked storage keeps the choice for this page view only.
  }
}
