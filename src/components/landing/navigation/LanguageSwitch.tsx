import type { Locale, SectionId } from "@/content"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import { ROOT_LOCALE_STORAGE_KEY } from "@/utils/rootLocale"
import type { MouseEvent } from "react"

type LanguageSwitchProps = {
  activeSectionId?: SectionId
  currentLocale: Locale
  label: string
  localeLabels: Record<Locale, string>
  localeHrefs?: Record<Locale, string>
  onLocaleSelect?: (locale: Locale) => void
  trackEvent?: AnalyticsTrack
}

export function LanguageSwitch({
  activeSectionId,
  currentLocale,
  label,
  localeLabels,
  localeHrefs,
  onLocaleSelect,
  trackEvent = track,
}: LanguageSwitchProps) {
  function selectLocale(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    if (locale !== currentLocale) {
      trackEvent({ name: "language_change", from: currentLocale, to: locale })
    }

    if (onLocaleSelect) {
      event.preventDefault()
      onLocaleSelect(locale)
      return
    }

    try {
      if (typeof window?.localStorage?.setItem === "function") {
        window.localStorage.setItem(ROOT_LOCALE_STORAGE_KEY, locale)
      }
    } catch {
      // Native navigation remains available when preference storage is blocked.
    }
  }

  return (
    <div className="language-switch" role="group" aria-label={label}>
      {(["pt", "en"] as const).map((locale) => {
        const fragment = activeSectionId ? `#${activeSectionId}` : ""

        return (
          <a
            key={locale}
            href={localeHrefs?.[locale] ?? `/${locale}${fragment}`}
            hrefLang={locale === "pt" ? "pt-BR" : "en"}
            lang={locale === "pt" ? "pt-BR" : "en"}
            aria-current={locale === currentLocale ? "page" : undefined}
            onClick={(event) => selectLocale(event, locale)}
          >
            {localeLabels[locale]}
          </a>
        )
      })}
    </div>
  )
}

export type { LanguageSwitchProps }
