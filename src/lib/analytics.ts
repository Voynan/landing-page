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
export type AnalyticsCapture = (eventName: string) => void | Promise<void>

type CreateAnalyticsOptions = {
  capture: AnalyticsCapture
  enabled: boolean
  // Before the visitor consents nothing is recorded, so an event is not even
  // remembered as seen and a product viewed earlier still counts afterwards.
  isActive?: () => boolean
}

// Clarity custom events carry no properties, so the single approved property
// of an event becomes part of its name.
function toClarityEventName(event: AllowedEvent): string {
  switch (event.name) {
    case "product_view":
    case "product_click":
      return `${event.name}:${event.productId}`
    case "contact_submit_error":
      return `${event.name}:${event.reason}`
    case "language_change":
      return `${event.name}:${event.from}-${event.to}`
    default:
      return event.name
  }
}

export function createAnalytics({
  capture,
  enabled,
  isActive = () => true,
}: CreateAnalyticsOptions) {
  const viewedProducts = new Set<string>()

  return {
    track(event: AllowedEvent): boolean {
      const result = allowedEventSchema.safeParse(event)

      if (!result.success || !enabled || !isActive()) return false

      if (
        result.data.name === "product_view" &&
        viewedProducts.has(result.data.productId)
      ) {
        return false
      }

      if (result.data.name === "product_view") {
        viewedProducts.add(result.data.productId)
      }

      try {
        const request = capture(toClarityEventName(result.data))
        void Promise.resolve(request).catch(() => undefined)
        return true
      } catch {
        return false
      }
    },
  }
}

export type ClarityConsentOptions = {
  ad_Storage: "granted" | "denied"
  analytics_Storage: "granted" | "denied"
}

export type ClarityClient = {
  init: (projectId: string) => void
  event: (eventName: string) => void
  consentV2: (options: ClarityConsentOptions) => void
}

export type AnalyticsRuntime = {
  setConsent: (granted: boolean) => void
}

type CreateClarityRuntimeOptions = {
  projectId: string | undefined
  loadClient: () => Promise<ClarityClient>
}

// The site runs no advertising, so ad storage is never granted; the visitor's
// choice only decides whether Clarity may set its analytics cookies.
function consentOptions(granted: boolean): ClarityConsentOptions {
  return {
    ad_Storage: "denied",
    analytics_Storage: granted ? "granted" : "denied",
  }
}

// Clarity is loaded only after the visitor grants consent: even in its
// no-consent mode, its tag and sync pixels make Microsoft set cookies on its
// own domains, so nothing is requested from Microsoft before that.
export function createClarityRuntime({
  projectId,
  loadClient,
}: CreateClarityRuntimeOptions): AnalyticsRuntime & {
  capture: AnalyticsCapture
  isActive: () => boolean
} {
  let resolveClient: (client: ClarityClient) => void = () => undefined
  const client = new Promise<ClarityClient>((resolve) => {
    resolveClient = resolve
  })
  let started = false

  return {
    setConsent(granted) {
      if (!projectId) return

      if (started) {
        void client
          .then((loaded) => loaded.consentV2(consentOptions(granted)))
          .catch(() => undefined)
        return
      }

      if (!granted) return
      started = true

      void loadClient()
        .then((loaded) => {
          loaded.init(projectId)
          loaded.consentV2(consentOptions(true))
          resolveClient(loaded)
        })
        .catch(() => undefined)
    },
    isActive() {
      return started
    },
    async capture(eventName) {
      // Events from before consent are dropped, never replayed afterwards.
      if (!started) return

      const loaded = await client
      loaded.event(eventName)
    },
  }
}

const clarityRuntime = createClarityRuntime({
  projectId: publicConfig.loadsClarity
    ? publicConfig.clarityProjectId
    : undefined,
  loadClient: () =>
    import("@microsoft/clarity").then(({ default: clarity }) => clarity),
})

const runtimeAnalytics = createAnalytics({
  capture: clarityRuntime.capture,
  enabled: publicConfig.analyticsEnabled && typeof window !== "undefined",
  isActive: clarityRuntime.isActive,
})

export const track = (event: AllowedEvent) => runtimeAnalytics.track(event)

export const analyticsRuntime: AnalyticsRuntime = {
  setConsent: clarityRuntime.setConsent,
}
