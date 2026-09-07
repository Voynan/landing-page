import type { Locale } from "@/content/contracts"

export const LOCALE_STORAGE_KEY = "voynan.locale"
export const LOCALE_QUERY_KEY = "lang"

const portugueseLanguageTag = /^pt\b/i

function asLocale(value: string | null | undefined): Locale | null {
  return value === "pt" || value === "en" ? value : null
}

type LocaleSignals = {
  searchParam?: string | null
  stored?: string | null
  preferredLanguages?: readonly string[]
}

export function resolveLocale({
  searchParam,
  stored,
  preferredLanguages,
}: LocaleSignals): Locale {
  const detected = preferredLanguages?.some((language) =>
    portugueseLanguageTag.test(language),
  )
    ? ("pt" as const)
    : null

  return asLocale(searchParam) ?? asLocale(stored) ?? detected ?? "en"
}

export function localeHref(
  path: string,
  locale: Locale,
  fragment?: string,
): string {
  const query = locale === "pt" ? `?${LOCALE_QUERY_KEY}=pt` : ""
  const hash = fragment ? `#${fragment}` : ""

  return `${path}${query}${hash}`
}

export function applyLocaleToUrl(url: URL, locale: Locale): URL {
  const next = new URL(url)

  if (locale === "pt") {
    next.searchParams.set(LOCALE_QUERY_KEY, "pt")
  } else {
    next.searchParams.delete(LOCALE_QUERY_KEY)
  }

  return next
}

export function htmlLang(locale: Locale): "pt-BR" | "en" {
  return locale === "pt" ? "pt-BR" : "en"
}
