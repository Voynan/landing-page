import { describe, expect, it } from "vitest"

import { getLegalDocument } from "@/content/legal"
import englishCommon from "@/i18n/locales/en/common.json"
import portugueseCommon from "@/i18n/locales/pt/common.json"

const cookiePreferencesLabel = {
  en: englishCommon.footer.cookiePreferences,
  pt: portugueseCommon.footer.cookiePreferences,
} as const

function privacyText(locale: "pt" | "en") {
  return getLegalDocument(locale, "privacy")
    .sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.items ?? []),
    ])
    .join("\n")
}

describe("privacy policy", () => {
  it.each(["pt", "en"] as const)(
    "names Clarity, its cookies, and the footer control in the %s edition",
    (locale) => {
      const text = privacyText(locale)

      expect(text).toContain("Microsoft Clarity")
      expect(text).toContain("_clck")
      expect(text).toContain("_clsk")
      expect(text).toContain(cookiePreferencesLabel[locale])
    },
  )

  it.each(["pt", "en"] as const)(
    "no longer names PostHog in the %s edition",
    (locale) => {
      expect(privacyText(locale)).not.toMatch(/posthog/i)
    },
  )

  it.each(["pt", "en"] as const)(
    "names the domains where Microsoft sets its own cookies in the %s edition",
    (locale) => {
      expect(privacyText(locale)).toContain("clarity.ms")
      expect(privacyText(locale)).toContain("bing.com")
    },
  )

  it("says Clarity loads only after consent instead of promising a cookieless mode", () => {
    const text = privacyText("en")

    expect(text).toContain(
      "Clarity is loaded only after you accept analytics cookies",
    )
    expect(text).not.toContain("Without your consent, Clarity sets no cookies")
  })

  it("keeps both editions paragraph-for-paragraph aligned", () => {
    const count = (locale: "pt" | "en") =>
      getLegalDocument(locale, "privacy").sections.map(
        (section) => section.paragraphs.length,
      )

    expect(count("pt")).toEqual(count("en"))
  })

  it("dates both editions to the Clarity change", () => {
    expect(getLegalDocument("en", "privacy").updatedDate).toBe(
      "October 17, 2026",
    )
    expect(getLegalDocument("pt", "privacy").updatedDate).toMatch(
      /^17 .+ 2026$/,
    )
  })
})
