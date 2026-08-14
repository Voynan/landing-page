import type { Locale, SectionId } from "@/content/contracts"

export function buildLocaleUrl(
  origin: string,
  locale: Locale,
  sectionId?: SectionId,
): string {
  let parsedOrigin: URL

  try {
    parsedOrigin = new URL(origin)
  } catch {
    throw new TypeError("A valid absolute origin is required")
  }

  if (!["http:", "https:"].includes(parsedOrigin.protocol)) {
    throw new TypeError("A valid absolute origin is required")
  }

  const localeUrl = new URL(`/${locale}`, parsedOrigin.origin)

  if (sectionId) {
    localeUrl.hash = sectionId
  }

  return localeUrl.toString()
}
