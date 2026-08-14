import { z } from "zod"

const optionalValue = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional()

const booleanFlag = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .optional()
  .transform((value) => value === true || value === "true")

export const publicEnvironmentSchema = z.object({
  DEV: z.boolean().optional().transform(Boolean),
  VITE_SITE_ORIGIN: optionalValue,
  VITE_CONTACT_ENDPOINT: optionalValue,
  VITE_ANTISPAM_SITE_KEY: optionalValue,
  VITE_POSTHOG_KEY: optionalValue,
  VITE_POSTHOG_HOST: optionalValue,
  VITE_ENABLE_DESIGN_SYSTEM: booleanFlag,
})

export type PublicEnvironment = z.input<typeof publicEnvironmentSchema>

export const releaseConfigSchema = z.object({
  siteOrigin: z.url({ protocol: /^https?$/ }).optional(),
  contactEndpoint: z.url({ protocol: /^https?$/ }).optional(),
  antispamSiteKey: z.string().trim().min(1).optional(),
  posthogKey: z.string().trim().min(1).optional(),
  posthogHost: z.url({ protocol: /^https?$/ }).optional(),
  enableDesignSystem: z.union([z.boolean(), z.enum(["true", "false"])]),
})

export type ReleaseConfigInput = z.input<typeof releaseConfigSchema>

export type PublicConfig = {
  siteOrigin?: string
  contactEndpoint?: string
  antispamSiteKey?: string
  posthogKey?: string
  posthogHost?: string
  enableDesignSystem: boolean
  isDevelopment: boolean
  analyticsEnabled: boolean
}
