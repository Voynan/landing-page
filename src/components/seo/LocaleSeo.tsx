import type { Locale } from "@/content/contracts"
import { htmlLang, localeHref } from "@/utils/locale"

type SeoMetadata = {
  approval?: unknown
  title?: string
  description?: string
  openGraphTitle?: string
  openGraphDescription?: string
}

type LocaleSeoProps = {
  locale: Locale
  metadata: SeoMetadata
  origin: string
  path?: string
}

const openGraphLocaleByLocale = {
  pt: "pt_BR",
  en: "en_US",
} as const

export function LocaleSeo({
  locale,
  metadata,
  origin,
  path = "/",
}: LocaleSeoProps) {
  const { title, description, openGraphTitle, openGraphDescription } = metadata

  if (!title || !description || !openGraphTitle || !openGraphDescription) {
    throw new Error(
      "Locale metadata requires title, description and Open Graph copy",
    )
  }

  const toAbsolute = (variant: Locale) =>
    new URL(localeHref(path, variant), origin).toString()
  const canonical = toAbsolute(locale)

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {(["en", "pt"] as const).map((alternateLocale) => (
        <link
          key={alternateLocale}
          rel="alternate"
          hrefLang={htmlLang(alternateLocale)}
          href={toAbsolute(alternateLocale)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={toAbsolute("en")} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={openGraphLocaleByLocale[locale]} />
      <meta property="og:title" content={openGraphTitle} />
      <meta property="og:description" content={openGraphDescription} />
      <meta property="og:url" content={canonical} />
    </>
  )
}
