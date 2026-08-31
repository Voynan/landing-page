import type { Locale } from "@/content/contracts"

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
  pathsByLocale?: Record<Locale, string>
}

const hrefLangByLocale = {
  pt: "pt-BR",
  en: "en",
} as const

const openGraphLocaleByLocale = {
  pt: "pt_BR",
  en: "en_US",
} as const

export function LocaleSeo({
  locale,
  metadata,
  origin,
  pathsByLocale = { pt: "/pt", en: "/en" },
}: LocaleSeoProps) {
  const { title, description, openGraphTitle, openGraphDescription } = metadata

  if (!title || !description || !openGraphTitle || !openGraphDescription) {
    throw new Error(
      "Locale metadata requires title, description and Open Graph copy",
    )
  }

  const canonical = new URL(pathsByLocale[locale], origin).toString()

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
          href={new URL(pathsByLocale[alternateLocale], origin).toString()}
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
