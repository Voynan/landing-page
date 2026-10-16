import { useEffect, useId, useRef } from "react"
import { useTranslation } from "react-i18next"

import { useAnalyticsConsent } from "@/app/analyticsConsentContext"
import { useLocale } from "@/app/localeContext"
import { Button } from "@/components/ui/button"
import { legalPaths } from "@/content/legal"
import { localeHref } from "@/utils/locale"

const bannerHeightProperty = "--consent-banner-height"

export function ConsentBanner() {
  const { isBannerOpen, openedByRequest, accept, decline } =
    useAnalyticsConsent()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const titleId = useId()
  const bannerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (isBannerOpen && openedByRequest) bannerRef.current?.focus()
  }, [isBannerOpen, openedByRequest])

  // The banner is fixed over the end of the page, so the page reserves its
  // measured height: the footer stays reachable and focused controls never
  // scroll underneath it, whatever the locale's copy length.
  useEffect(() => {
    const banner = bannerRef.current
    const root = document.documentElement

    if (!isBannerOpen || !banner || typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty(
        bannerHeightProperty,
        `${Math.ceil(entry.borderBoxSize[0]?.blockSize ?? banner.offsetHeight)}px`,
      )
    })

    observer.observe(banner)

    return () => {
      observer.disconnect()
      root.style.removeProperty(bannerHeightProperty)
    }
  }, [isBannerOpen])

  if (!isBannerOpen) return null

  return (
    <section
      ref={bannerRef}
      className="consent-banner"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className="consent-banner__frame">
        <div className="consent-banner__copy">
          <p id={titleId} className="consent-banner__title">
            {t("consent.title")}
          </p>
          <p className="consent-banner__body">
            {t("consent.body")}{" "}
            <a href={localeHref(legalPaths.privacy, locale)}>
              {t("consent.privacyLink")}
            </a>
          </p>
        </div>
        <div className="consent-banner__actions">
          <Button type="button" variant="outline" onClick={decline}>
            {t("consent.decline")}
          </Button>
          <Button type="button" variant="outline" onClick={accept}>
            {t("consent.accept")}
          </Button>
        </div>
      </div>
    </section>
  )
}
