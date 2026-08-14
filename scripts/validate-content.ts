import {
  assertPublishableContent,
  type LandingContentDraft,
  type Locale,
} from "../src/content/contracts.js"
import { getLandingContent } from "../src/content/index.js"
import {
  assertReleaseConfig,
  publicConfig,
} from "../src/config/publicConfig.js"
import type { ReleaseConfigInput } from "../src/schemas/publicConfig.js"

type ReleaseValidationInput = {
  config: ReleaseConfigInput
  contentByLocale: Record<Locale, LandingContentDraft>
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function validateRelease({
  config,
  contentByLocale,
}: ReleaseValidationInput): void {
  const failures: string[] = []

  try {
    assertReleaseConfig(config)
  } catch (error) {
    failures.push(`Configuration\n${errorMessage(error)}`)
  }

  const localeLabels = {
    pt: "Português (pt)",
    en: "English (en)",
  } satisfies Record<Locale, string>

  for (const locale of ["pt", "en"] as const) {
    try {
      assertPublishableContent(contentByLocale[locale])
    } catch (error) {
      failures.push(`${localeLabels[locale]}\n${errorMessage(error)}`)
    }
  }

  if (failures.length > 0) {
    throw new Error(`Release validation failed:\n\n${failures.join("\n\n")}`)
  }
}

if (import.meta.main) {
  validateRelease({
    config: publicConfig,
    contentByLocale: {
      pt: getLandingContent("pt"),
      en: getLandingContent("en"),
    },
  })
}
