import {
  AegisOpenSourceChapter,
  type AegisOpenSourceLabels,
} from "@/components/landing/aegis/AegisOpenSourceChapter"
import {
  CredibilityField,
  type CredibilityFieldLabels,
} from "@/components/landing/credibility/CredibilityField"
import {
  ContactSection,
  type ContactSectionLabels,
} from "@/components/landing/contact/ContactSection"
import {
  FounderNote,
  type FounderNoteLabels,
} from "@/components/landing/founder/FounderNote"
import {
  AtmosphericFooter,
  type AtmosphericFooterLabels,
} from "@/components/landing/footer/AtmosphericFooter"
import { ProductStudioHero } from "@/components/landing/hero/ProductStudioHero"
import {
  ProgressiveNav,
  type ProgressiveNavContent,
} from "@/components/landing/navigation/ProgressiveNav"
import {
  SaaSStoryStage,
  type SaaSStoryStageLabels,
} from "@/components/landing/products/SaaSStoryStage"
import {
  BuildWithUsFlow,
  type BuildWithUsFlowLabels,
} from "@/components/landing/services/BuildWithUsFlow"
import { useContactRuntime } from "@/app/contactRuntimeContext"
import { StudioThesis } from "@/components/landing/thesis/StudioThesis"
import { SkipLink } from "@/components/ui/SkipLink"
import type { LandingContentDraft } from "@/content"

type SupportingChapterLabels = {
  credibility: CredibilityFieldLabels
  services: BuildWithUsFlowLabels
  aegis: AegisOpenSourceLabels
  founder: FounderNoteLabels
  contact: ContactSectionLabels
  footer: AtmosphericFooterLabels
}

type LandingShellProps = {
  content: LandingContentDraft
  navigationContent: ProgressiveNavContent
  productStageLabels: SaaSStoryStageLabels
  skipLinkLabel: string
  supportingChapterLabels: SupportingChapterLabels
}

export function LandingShell({
  content,
  navigationContent,
  productStageLabels,
  skipLinkLabel,
  supportingChapterLabels,
}: LandingShellProps) {
  const { requestAntispamToken } = useContactRuntime()

  return (
    <div className="landing-page" data-locale={content.locale}>
      <SkipLink targetId="main-content">{skipLinkLabel}</SkipLink>
      <ProgressiveNav
        content={navigationContent}
        currentLocale={content.locale}
      />
      <main id="main-content" className="landing-main">
        <ProductStudioHero content={content.hero} />
        <StudioThesis content={content.thesis} />
        <SaaSStoryStage
          labels={productStageLabels}
          motionMode="auto"
          products={content.products.items}
        />
        <CredibilityField
          content={content.credibility}
          labels={supportingChapterLabels.credibility}
        />
        <BuildWithUsFlow
          content={content.services}
          labels={supportingChapterLabels.services}
        />
        <AegisOpenSourceChapter
          content={content.aegis}
          labels={supportingChapterLabels.aegis}
        />
        <FounderNote
          content={content.founder}
          labels={supportingChapterLabels.founder}
        />
        <ContactSection
          content={content.contact}
          labels={supportingChapterLabels.contact}
          requestAntispamToken={requestAntispamToken}
        />
      </main>
      <AtmosphericFooter
        content={content}
        labels={supportingChapterLabels.footer}
      />
    </div>
  )
}

export type { LandingShellProps, SupportingChapterLabels }
