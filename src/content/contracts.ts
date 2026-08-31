import { z } from "zod"

export const productIds = [
  "cryptovault",
  "bullledger",
  "safenumber",
  "constrully",
] as const
export const productStages = ["production", "development"] as const
export const locales = ["pt", "en"] as const
export const sectionIds = [
  "hero",
  "thesis",
  "products",
  "credibility",
  "services",
  "aegis",
  "founder",
  "contact",
] as const

export type ProductId = (typeof productIds)[number]
export type ProductStage = (typeof productStages)[number]
export type Locale = (typeof locales)[number]
export type SectionId = (typeof sectionIds)[number]

export const approvalSchema = z.enum([
  "missing",
  "received",
  "reviewed",
  "approved",
])
export type Approval = z.infer<typeof approvalSchema>

const pendingApprovalSchema = z.enum(["missing", "received", "reviewed"])
const nonEmptyString = z.string().trim().min(1)
const optionalNonEmptyString = nonEmptyString.optional()
const approvedUrl = z.url({ protocol: /^https?$/ })
const approvedLegalHref = z.union([
  approvedUrl,
  z.string().regex(/^\/(?!\/)/, "Expected an internal path or HTTP(S) URL"),
])

const pendingLinkSchema = z.object({
  label: nonEmptyString,
  href: approvedUrl.optional(),
  approval: pendingApprovalSchema,
})

const approvedLinkSchema = z.object({
  label: nonEmptyString,
  href: approvedUrl,
  approval: z.literal("approved"),
})

export const linkDraftSchema = z.discriminatedUnion("approval", [
  pendingLinkSchema,
  approvedLinkSchema,
])

const pendingLegalLinkSchema = z.object({
  label: nonEmptyString,
  href: approvedLegalHref.optional(),
  approval: pendingApprovalSchema,
})

const approvedLegalLinkSchema = z.object({
  label: nonEmptyString,
  href: approvedLegalHref,
  approval: z.literal("approved"),
})

export const legalLinkDraftSchema = z.discriminatedUnion("approval", [
  pendingLegalLinkSchema,
  approvedLegalLinkSchema,
])

export type ApprovedLink = z.infer<typeof approvedLinkSchema>

export const socialPlatforms = ["linkedin", "instagram", "x", "github"] as const
export type SocialPlatform = (typeof socialPlatforms)[number]

const pendingSocialProfileSchema = z.object({
  platform: z.enum(socialPlatforms),
  label: nonEmptyString,
  href: approvedUrl.optional(),
  approval: pendingApprovalSchema,
})

const approvedSocialProfileSchema = z.object({
  platform: z.enum(socialPlatforms),
  label: nonEmptyString,
  href: approvedUrl,
  approval: z.literal("approved"),
})

export const socialProfileDraftSchema = z.discriminatedUnion("approval", [
  pendingSocialProfileSchema,
  approvedSocialProfileSchema,
])

export type SocialProfileDraft = z.infer<typeof socialProfileDraftSchema>

const socialProfilesSchema = z
  .array(socialProfileDraftSchema)
  .min(1)
  .superRefine((profiles, context) => {
    const seen = new Set<SocialPlatform>()

    profiles.forEach((profile, index) => {
      if (seen.has(profile.platform)) {
        context.addIssue({
          code: "custom",
          path: [index, "platform"],
          message: `Duplicate social platform ${profile.platform}`,
        })
      }

      seen.add(profile.platform)
    })
  })

const pendingMetricSchema = z.object({
  value: optionalNonEmptyString,
  period: optionalNonEmptyString,
  definition: optionalNonEmptyString,
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const verifiedMetricSchema = z.object({
  value: nonEmptyString,
  period: nonEmptyString,
  definition: nonEmptyString,
  source: nonEmptyString,
  approval: z.literal("approved"),
})

export const metricDraftSchema = z.discriminatedUnion("approval", [
  pendingMetricSchema,
  verifiedMetricSchema,
])

export type VerifiedMetric = z.infer<typeof verifiedMetricSchema>

const testimonialPermissionsSchema = z.object({
  text: z.literal(true),
  name: z.literal(true),
  role: z.literal(true),
  company: z.literal(true),
  translation: z.literal(true),
  photo: z.boolean().optional(),
  logo: z.boolean().optional(),
})

const pendingTestimonialSchema = z.object({
  quote: optionalNonEmptyString,
  name: optionalNonEmptyString,
  role: optionalNonEmptyString,
  company: optionalNonEmptyString,
  source: optionalNonEmptyString,
  permissions: testimonialPermissionsSchema.partial().optional(),
  approval: pendingApprovalSchema,
})

const approvedTestimonialSchema = z.object({
  quote: nonEmptyString,
  name: nonEmptyString,
  role: nonEmptyString,
  company: nonEmptyString,
  source: nonEmptyString,
  permissions: testimonialPermissionsSchema,
  approval: z.literal("approved"),
})

export const testimonialDraftSchema = z.discriminatedUnion("approval", [
  pendingTestimonialSchema,
  approvedTestimonialSchema,
])

const claimCategorySchema = z.enum(["legal", "financial", "tax"])

const pendingClaimSchema = z.object({
  text: nonEmptyString,
  category: claimCategorySchema,
  jurisdiction: optionalNonEmptyString,
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const approvedClaimSchema = z.object({
  text: nonEmptyString,
  category: claimCategorySchema,
  jurisdiction: nonEmptyString,
  source: nonEmptyString,
  approval: z.literal("approved"),
})

const claimDraftSchema = z.discriminatedUnion("approval", [
  pendingClaimSchema,
  approvedClaimSchema,
])

const pendingMediaSchema = z.object({
  desktopSrc: optionalNonEmptyString,
  mobileSrc: optionalNonEmptyString,
  posterSrc: optionalNonEmptyString,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: optionalNonEmptyString,
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const approvedMediaSchema = z.object({
  desktopSrc: nonEmptyString,
  mobileSrc: nonEmptyString,
  posterSrc: nonEmptyString,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: nonEmptyString,
  source: nonEmptyString,
  approval: z.literal("approved"),
})

const mediaDraftSchema = z.discriminatedUnion("approval", [
  pendingMediaSchema,
  approvedMediaSchema,
])

const pendingBrandLogoSchema = z.object({
  src: optionalNonEmptyString,
  alt: optionalNonEmptyString,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const approvedBrandLogoSchema = z.object({
  src: nonEmptyString,
  alt: nonEmptyString,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: nonEmptyString,
  approval: z.literal("approved"),
})

const brandLogoDraftSchema = z.discriminatedUnion("approval", [
  pendingBrandLogoSchema,
  approvedBrandLogoSchema,
])

const pendingAegisEvidenceSchema = z.object({
  releaseStatus: optionalNonEmptyString,
  license: optionalNonEmptyString,
  code: optionalNonEmptyString,
  environments: z.array(nonEmptyString).optional(),
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const approvedAegisEvidenceSchema = z.object({
  releaseStatus: nonEmptyString,
  license: nonEmptyString,
  code: nonEmptyString,
  environments: z.array(nonEmptyString).min(1),
  source: nonEmptyString,
  approval: z.literal("approved"),
})

const aegisEvidenceDraftSchema = z.discriminatedUnion("approval", [
  pendingAegisEvidenceSchema,
  approvedAegisEvidenceSchema,
])

const pendingFounderProfileSchema = z.object({
  name: optionalNonEmptyString,
  role: nonEmptyString,
  note: optionalNonEmptyString,
  portraitSrc: optionalNonEmptyString,
  portraitAlt: optionalNonEmptyString,
  source: optionalNonEmptyString,
  approval: pendingApprovalSchema,
})

const approvedFounderProfileSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  note: nonEmptyString,
  portraitSrc: nonEmptyString,
  portraitAlt: nonEmptyString,
  source: nonEmptyString,
  approval: z.literal("approved"),
})

const founderProfileDraftSchema = z.discriminatedUnion("approval", [
  pendingFounderProfileSchema,
  approvedFounderProfileSchema,
])

const pendingEmailSchema = z.object({
  label: nonEmptyString,
  address: z.email().optional(),
  approval: pendingApprovalSchema,
})

const approvedEmailSchema = z.object({
  label: nonEmptyString,
  address: z.email(),
  approval: z.literal("approved"),
})

const emailDraftSchema = z.discriminatedUnion("approval", [
  pendingEmailSchema,
  approvedEmailSchema,
])

const metadataDraftSchema = z.object({
  title: optionalNonEmptyString,
  description: optionalNonEmptyString,
  openGraphTitle: optionalNonEmptyString,
  openGraphDescription: optionalNonEmptyString,
  approval: approvalSchema,
})

const heroSchema = z.object({
  id: z.literal("hero"),
  kicker: nonEmptyString,
  title: nonEmptyString,
  support: nonEmptyString,
  contextLine: nonEmptyString,
  productCta: z.object({
    label: nonEmptyString,
    sectionId: z.literal("products"),
  }),
  contactCta: z.object({
    label: nonEmptyString,
    sectionId: z.literal("contact"),
  }),
  approval: approvalSchema,
})

const thesisSchema = z.object({
  id: z.literal("thesis"),
  statement: nonEmptyString,
  approval: approvalSchema,
})

const productSchema = z.object({
  id: z.enum(productIds),
  name: nonEmptyString,
  stage: z.enum(productStages),
  kicker: nonEmptyString,
  title: nonEmptyString,
  support: nonEmptyString,
  capabilities: z.array(nonEmptyString).length(3),
  destination: linkDraftSchema,
  claimReview: claimDraftSchema,
  media: mediaDraftSchema,
  copyApproval: approvalSchema,
})

const productsSchema = z.object({
  id: z.literal("products"),
  kicker: nonEmptyString,
  title: nonEmptyString,
  summary: nonEmptyString,
  closing: nonEmptyString,
  items: z
    .tuple([productSchema, productSchema, productSchema, productSchema])
    .superRefine((items, context) => {
      const expectedIds: ProductId[] = [...productIds]

      items.forEach((item, index) => {
        if (item.id !== expectedIds[index]) {
          context.addIssue({
            code: "custom",
            path: [index, "id"],
            message: `Expected ${expectedIds[index]} at product position ${index + 1}`,
          })
        }
      })
    }),
})

const credibilitySchema = z.object({
  id: z.literal("credibility"),
  metrics: z.array(metricDraftSchema).min(3).max(4),
  testimonials: z.array(testimonialDraftSchema).min(3).max(5),
})

const servicesSchema = z.object({
  id: z.literal("services"),
  kicker: nonEmptyString,
  title: nonEmptyString,
  support: nonEmptyString,
  layers: z
    .array(
      z.object({
        title: nonEmptyString,
        capabilities: z.array(nonEmptyString).min(1),
      }),
    )
    .length(4),
  cta: z.object({
    label: nonEmptyString,
    sectionId: z.literal("contact"),
  }),
  approval: approvalSchema,
})

const aegisSchema = z.object({
  id: z.literal("aegis"),
  stage: z.enum(["development", "released"]),
  kicker: nonEmptyString,
  title: nonEmptyString,
  support: nonEmptyString,
  github: linkDraftSchema,
  documentation: linkDraftSchema,
  technicalEvidence: aegisEvidenceDraftSchema,
  logo: brandLogoDraftSchema,
  copyApproval: approvalSchema,
})

const founderSchema = z.object({
  id: z.literal("founder"),
  profile: founderProfileDraftSchema,
  social: socialProfilesSchema,
})

const contactSchema = z.object({
  id: z.literal("contact"),
  title: nonEmptyString,
  commercialNote: nonEmptyString,
  ctaLabel: nonEmptyString,
  publicEmail: emailDraftSchema,
  social: socialProfilesSchema,
  privacyPolicy: legalLinkDraftSchema,
  terms: legalLinkDraftSchema,
  copyApproval: approvalSchema,
})

const footerSchema = z.object({
  creatorNotice: optionalNonEmptyString,
  approval: approvalSchema,
})

export const landingContentDraftSchema = z.object({
  locale: z.enum(locales),
  metadata: metadataDraftSchema,
  hero: heroSchema,
  thesis: thesisSchema,
  products: productsSchema,
  credibility: credibilitySchema,
  services: servicesSchema,
  aegis: aegisSchema,
  founder: founderSchema,
  contact: contactSchema,
  footer: footerSchema,
})

export type LandingContentDraft = z.infer<typeof landingContentDraftSchema>

declare const publishedContent: unique symbol
export type PublishedLandingContent = LandingContentDraft & {
  readonly [publishedContent]: true
}

type ApprovalRecord = { approval: Approval }

function addApprovalBlocker(
  blockers: string[],
  path: string,
  item: ApprovalRecord,
) {
  if (item.approval !== "approved") {
    blockers.push(`${path} must be approved (currently ${item.approval})`)
  }
}

export function getPublicationBlockers(input: LandingContentDraft): string[] {
  const content = landingContentDraftSchema.parse(input)
  const blockers: string[] = []

  addApprovalBlocker(blockers, "metadata", content.metadata)
  addApprovalBlocker(blockers, "hero", content.hero)
  addApprovalBlocker(blockers, "thesis", content.thesis)

  content.products.items.forEach((product, index) => {
    const path = `products.items.${index}`
    addApprovalBlocker(blockers, `${path}.copyApproval`, {
      approval: product.copyApproval,
    })
    addApprovalBlocker(blockers, `${path}.claimReview`, product.claimReview)
    if (product.stage === "production") {
      addApprovalBlocker(blockers, `${path}.destination`, product.destination)
      addApprovalBlocker(blockers, `${path}.media`, product.media)
    }
  })

  content.credibility.metrics.forEach((metric, index) => {
    addApprovalBlocker(blockers, `credibility.metrics.${index}`, metric)
  })
  content.credibility.testimonials.forEach((testimonial, index) => {
    addApprovalBlocker(
      blockers,
      `credibility.testimonials.${index}`,
      testimonial,
    )
  })

  addApprovalBlocker(blockers, "services", content.services)
  addApprovalBlocker(blockers, "aegis.copyApproval", {
    approval: content.aegis.copyApproval,
  })
  addApprovalBlocker(blockers, "aegis.github", content.aegis.github)
  if (content.aegis.stage === "released") {
    addApprovalBlocker(
      blockers,
      "aegis.documentation",
      content.aegis.documentation,
    )
    addApprovalBlocker(
      blockers,
      "aegis.technicalEvidence",
      content.aegis.technicalEvidence,
    )
  }
  addApprovalBlocker(blockers, "aegis.logo", content.aegis.logo)
  addApprovalBlocker(blockers, "founder.profile", content.founder.profile)
  content.founder.social.forEach((profile, index) => {
    addApprovalBlocker(blockers, `founder.social.${index}`, profile)
  })
  addApprovalBlocker(blockers, "contact.copyApproval", {
    approval: content.contact.copyApproval,
  })
  addApprovalBlocker(
    blockers,
    "contact.publicEmail",
    content.contact.publicEmail,
  )
  content.contact.social.forEach((profile, index) => {
    addApprovalBlocker(blockers, `contact.social.${index}`, profile)
  })
  addApprovalBlocker(
    blockers,
    "contact.privacyPolicy",
    content.contact.privacyPolicy,
  )
  addApprovalBlocker(blockers, "contact.terms", content.contact.terms)
  addApprovalBlocker(blockers, "footer", content.footer)

  return blockers
}

export function assertPublishableContent(
  content: LandingContentDraft,
): asserts content is PublishedLandingContent {
  const blockers = getPublicationBlockers(content)

  if (blockers.length > 0) {
    throw new Error(
      `Landing content is not publishable:\n${blockers
        .map((blocker) => `- ${blocker}`)
        .join("\n")}`,
    )
  }
}
