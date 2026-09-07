import type { MouseEvent } from "react"

import { useLocale } from "@/app/localeContext"
import type { Locale, SectionId } from "@/content"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import { htmlLang, localeHref } from "@/utils/locale"

type LanguageSwitchProps = {
  activeSectionId?: SectionId
  label: string
  localeLabels: Record<Locale, string>
  path?: string
  trackEvent?: AnalyticsTrack
}

export function LanguageSwitch({
  activeSectionId,
  label,
  localeLabels,
  path = "/",
  trackEvent = track,
}: LanguageSwitchProps) {
  const { locale: currentLocale, setLocale } = useLocale()

  function selectLocale(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    event.preventDefault()

    if (locale === currentLocale) {
      return
    }

    trackEvent({ name: "language_change", from: currentLocale, to: locale })
    setLocale(locale)
  }

  return (
    <div className="language-switch" role="group" aria-label={label}>
      {(["pt", "en"] as const).map((locale) => (
        <a
          key={locale}
          href={localeHref(path, locale, activeSectionId)}
          hrefLang={htmlLang(locale)}
          lang={htmlLang(locale)}
          aria-current={locale === currentLocale ? "page" : undefined}
          onClick={(event) => selectLocale(event, locale)}
        >
          {localeLabels[locale]}
        </a>
      ))}
    </div>
  )
}

export type { LanguageSwitchProps }
