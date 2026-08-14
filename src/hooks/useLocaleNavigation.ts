import { useCallback } from "react"

import type { Locale, SectionId } from "@/content/contracts"
import { ROOT_LOCALE_STORAGE_KEY } from "@/utils/rootLocale"

type LocaleNavigationEnvironment = {
  navigate: (destination: string) => void
  storage: Pick<Storage, "setItem">
}

export function switchLocale(
  nextLocale: Locale,
  currentSectionId?: SectionId,
  environment?: LocaleNavigationEnvironment,
): void {
  const fragment = currentSectionId ? `#${currentSectionId}` : ""
  const destination = `/${nextLocale}${fragment}`
  const browserEnvironment = environment ?? {
    navigate: (nextDestination: string) =>
      window.location.assign(nextDestination),
    storage: window.localStorage,
  }

  browserEnvironment.storage.setItem(ROOT_LOCALE_STORAGE_KEY, nextLocale)
  browserEnvironment.navigate(destination)
}

export function useLocaleNavigation() {
  return useCallback(
    (nextLocale: Locale, currentSectionId?: SectionId) =>
      switchLocale(nextLocale, currentSectionId),
    [],
  )
}
