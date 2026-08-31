import type { LandingContentDraft, Locale } from "./contracts.js"
import { englishLandingContent } from "./en/landing.js"
import { portugueseLandingContent } from "./pt/landing.js"

const contentByLocale = {
  pt: portugueseLandingContent,
  en: englishLandingContent,
} satisfies Record<Locale, LandingContentDraft>

export function getLandingContent(locale: Locale): LandingContentDraft {
  return contentByLocale[locale]
}

export type {
  Approval,
  LandingContentDraft,
  Locale,
  ProductId,
  ProductStage,
  PublishedLandingContent,
  SectionId,
  SocialPlatform,
  SocialProfileDraft,
} from "./contracts.js"
