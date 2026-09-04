import type { LandingContentDraft } from "@/content"
import type { ClipboardWriter } from "@/utils/clipboard"
import type { AnalyticsTrack } from "@/lib/analytics"
import type { ContactInput, ContactSubmissionResult } from "@/schemas/contact"
import {
  EssentialContactForm,
  type ContactFormLabels,
} from "@/components/landing/contact/EssentialContactForm"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"

type ContactContent = LandingContentDraft["contact"]

export type ContactSectionLabels = ContactFormLabels & {
  sectionLabel: string
}

type ContactSectionProps = {
  clipboard?: ClipboardWriter | null
  content: ContactContent
  labels: ContactSectionLabels
  requestAntispamToken?: () => Promise<string>
  submit?: (
    input: ContactInput,
    antispamToken: string,
  ) => Promise<ContactSubmissionResult>
  trackEvent?: AnalyticsTrack
}

export function ContactSection({
  clipboard,
  content,
  labels,
  requestAntispamToken,
  submit,
  trackEvent,
}: ContactSectionProps) {
  const publicEmail =
    content.publicEmail.approval === "approved"
      ? content.publicEmail.address
      : undefined
  const privacyPolicy =
    content.privacyPolicy.approval === "approved"
      ? {
          href: content.privacyPolicy.href,
          label: content.privacyPolicy.label,
        }
      : undefined

  return (
    <section
      id={content.id}
      className="contact-section"
      aria-label={labels.sectionLabel}
    >
      <PearlescentStarfield motionId="contact-starfield-drift" variant={6} />

      <div className="contact-section__intro">
        <h2>{content.title}</h2>
        <p>{content.commercialNote}</p>
      </div>

      <EssentialContactForm
        clipboard={clipboard}
        ctaLabel={content.ctaLabel}
        labels={labels}
        privacyPolicy={privacyPolicy}
        publicEmail={publicEmail}
        requestAntispamToken={requestAntispamToken}
        submit={submit}
        trackEvent={trackEvent}
      />
    </section>
  )
}

export type { ContactSectionProps }
