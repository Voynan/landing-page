import { z } from "zod"

import { publicConfig } from "@/config/publicConfig"
import { productIds } from "@/content/contracts"

const productIdSchema = z.enum(productIds)
const contactErrorSchema = z.enum([
  "validation",
  "timeout",
  "rejected",
  "network",
])
const localeSchema = z.enum(["pt", "en"])

const allowedEventSchema = z.discriminatedUnion("name", [
  z.object({ name: z.literal("hero_product_click") }).strict(),
  z.object({ name: z.literal("hero_contact_click") }).strict(),
  z
    .object({ name: z.literal("product_view"), productId: productIdSchema })
    .strict(),
  z
    .object({ name: z.literal("product_click"), productId: productIdSchema })
    .strict(),
  z.object({ name: z.literal("aegis_github_click") }).strict(),
  z.object({ name: z.literal("aegis_docs_click") }).strict(),
  z.object({ name: z.literal("contact_start") }).strict(),
  z.object({ name: z.literal("contact_submit_success") }).strict(),
  z
    .object({
      name: z.literal("contact_submit_error"),
      reason: contactErrorSchema,
    })
    .strict(),
  z.object({ name: z.literal("email_copy") }).strict(),
  z
    .object({
      name: z.literal("language_change"),
      from: localeSchema,
      to: localeSchema,
    })
    .strict(),
])

export type AllowedEvent = z.infer<typeof allowedEventSchema>
export type AnalyticsTrack = (event: AllowedEvent) => unknown
export type AnalyticsCapture = (
  name: AllowedEvent["name"],
  properties: Record<string, unknown>,
) => void | Promise<void>

type CreateAnalyticsOptions = {
  capture: AnalyticsCapture
  enabled: boolean
}

export function createAnalytics({ capture, enabled }: CreateAnalyticsOptions) {
  const viewedProducts = new Set<string>()

  return {
    track(event: AllowedEvent): boolean {
      const result = allowedEventSchema.safeParse(event)

      if (!result.success || !enabled) return false

      if (
        result.data.name === "product_view" &&
        viewedProducts.has(result.data.productId)
      ) {
        return false
      }

      if (result.data.name === "product_view") {
        viewedProducts.add(result.data.productId)
      }

      const { name, ...properties } = result.data

      try {
        const request = capture(name, properties)
        void Promise.resolve(request).catch(() => undefined)
        return true
      } catch {
        return false
      }
    },
  }
}

let posthogClientPromise:
  Promise<(typeof import("posthog-js"))["default"]> | undefined

function getPostHogClient() {
  if (!posthogClientPromise) {
    posthogClientPromise = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(publicConfig.posthogKey!, {
        api_host: publicConfig.posthogHost,
        autocapture: false,
        capture_pageleave: false,
        capture_pageview: false,
        disable_session_recording: true,
        persistence: "memory",
        person_profiles: "identified_only",
      })

      return posthog
    })
  }

  return posthogClientPromise
}

const captureWithPostHog: AnalyticsCapture = async (name, properties) => {
  const posthog = await getPostHogClient()
  posthog.capture(name, properties)
}

const runtimeAnalytics = createAnalytics({
  capture: captureWithPostHog,
  enabled: publicConfig.analyticsEnabled && typeof window !== "undefined",
})

export const track = (event: AllowedEvent) => runtimeAnalytics.track(event)
