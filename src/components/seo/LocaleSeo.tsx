import type { LandingContentDraft, Locale } from "@/content/contracts"
import { buildLocaleUrl } from "@/utils/localeUrl"

type LocaleSeoProps = {
  locale: Locale
  metadata: LandingContentDraft["metadata"]
  origin: string
}

const hrefLangByLocale = {
  pt: "pt-BR",
  en: "en",
} as const

const openGraphLocaleByLocale = {
  pt: "pt_BR",
  en: "en_US",
} as const

export function LocaleSeo({ locale, metadata, origin }: LocaleSeoProps) {
  const { title, description, openGraphTitle, openGraphDescription } = metadata

  if (!title || !description || !openGraphTitle || !openGraphDescription) {
    throw new Error(
      "Locale metadata requires title, description and Open Graph copy",
    )
  }

  const canonical = buildLocaleUrl(origin, locale)

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {(["pt", "en"] as const).map((alternateLocale) => (
        <link
          key={alternateLocale}
          rel="alternate"
          hrefLang={hrefLangByLocale[alternateLocale]}
          href={buildLocaleUrl(origin, alternateLocale)}
        />
      ))}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={openGraphLocaleByLocale[locale]} />
      <meta property="og:title" content={openGraphTitle} />
      <meta property="og:description" content={openGraphDescription} />
      <meta property="og:url" content={canonical} />
    </>
  )
}
