import {
  publicEnvironmentSchema,
  releaseConfigSchema,
  type PublicConfig,
  type ReleaseConfigInput,
} from "../schemas/publicConfig.js"

function trimTrailingSlash(value: string | undefined) {
  return value?.replace(/\/+$/, "")
}

export function readPublicConfig(
  environment: Record<string, unknown>,
): PublicConfig {
  const parsed = publicEnvironmentSchema.parse(environment)
  const siteOrigin = trimTrailingSlash(parsed.VITE_SITE_ORIGIN)
  const contactEndpoint = trimTrailingSlash(parsed.VITE_CONTACT_ENDPOINT)
  const posthogHost = trimTrailingSlash(parsed.VITE_POSTHOG_HOST)

  return {
    siteOrigin,
    contactEndpoint,
    antispamSiteKey: parsed.VITE_ANTISPAM_SITE_KEY,
    posthogKey: parsed.VITE_POSTHOG_KEY,
    posthogHost,
    enableDesignSystem: parsed.VITE_ENABLE_DESIGN_SYSTEM,
    isDevelopment: parsed.DEV,
    analyticsEnabled: Boolean(parsed.VITE_POSTHOG_KEY && posthogHost),
  }
}

export function assertReleaseConfig(config: ReleaseConfigInput): void {
  const parsed = releaseConfigSchema.parse(config)
  const blockers: string[] = []

  if (!parsed.siteOrigin) {
    blockers.push("VITE_SITE_ORIGIN is required for release")
  }
  if (!parsed.contactEndpoint) {
    blockers.push("VITE_CONTACT_ENDPOINT is required for release")
  }
  if (!parsed.antispamSiteKey) {
    blockers.push("VITE_ANTISPAM_SITE_KEY is required for release")
  }
  if (
    parsed.enableDesignSystem === true ||
    parsed.enableDesignSystem === "true"
  ) {
    blockers.push("VITE_ENABLE_DESIGN_SYSTEM must be false for release")
  }

  if (blockers.length > 0) {
    throw new Error(
      `Public configuration is not ready for release:\n${blockers
        .map((blocker) => `- ${blocker}`)
        .join("\n")}`,
    )
  }
}

export const publicConfig = readPublicConfig(import.meta.env)
