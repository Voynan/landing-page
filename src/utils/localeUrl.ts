import type { Locale, SectionId } from "@/content/contracts"
import { localeHref } from "@/utils/locale"

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

  return `${parsedOrigin.origin}${localeHref("/", locale, sectionId)}`
}
