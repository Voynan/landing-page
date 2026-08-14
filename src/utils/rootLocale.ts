export type PublicLocale = "pt" | "en"

export const ROOT_LOCALE_STORAGE_KEY = "voynan.locale"

export function resolveRootLocale(savedLocale: string | null): PublicLocale {
  return savedLocale === "en" ? "en" : "pt"
}
