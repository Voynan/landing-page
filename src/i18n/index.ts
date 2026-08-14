import i18next, { type i18n } from "i18next"

import type { Locale } from "@/content/contracts"
import englishCommon from "@/i18n/locales/en/common.json"
import portugueseCommon from "@/i18n/locales/pt/common.json"

const resources = {
  pt: { common: portugueseCommon },
  en: { common: englishCommon },
} as const

export function createI18n(locale: Locale): i18n {
  const instance = i18next.createInstance()

  void instance.init({
    lng: locale,
    fallbackLng: "pt",
    defaultNS: "common",
    resources,
    interpolation: { escapeValue: false },
    initAsync: false,
  })

  return instance
}
