import { AppProviders } from "@/app/AppProviders"
import { LandingShell } from "@/components/landing/LandingShell"
import { getLandingContent } from "@/content"
import type { PublicLocale } from "@/utils/rootLocale"
import { useTranslation } from "react-i18next"

type LocaleLandingPageProps = {
  locale: PublicLocale
}

export function LocaleLandingPage({ locale }: LocaleLandingPageProps) {
  return (
    <AppProviders locale={locale}>
      <LocalizedLandingPage locale={locale} />
    </AppProviders>
  )
}

function LocalizedLandingPage({ locale }: LocaleLandingPageProps) {
  const { t } = useTranslation()
  const content = getLandingContent(locale)

  return (
    <LandingShell
      content={content}
      productStageLabels={{
        sectionLabel: t("products.sectionLabel"),
        progressLabel: t("products.progressLabel"),
        conceptualEvidence: t("products.conceptualEvidence"),
        destinationPending: t("products.destinationPending"),
        productionStatus: t("products.productionStatus"),
        developmentStatus: t("products.developmentStatus"),
        productionShortStatus: t("products.productionShortStatus"),
        developmentShortStatus: t("products.developmentShortStatus"),
        mobileGridLabel: t("products.mobileGridLabel"),
        mobileInteractionHint: t("products.mobileInteractionHint"),
        collapseProduct: t("products.collapseProduct"),
        previousProduct: t("products.previousProduct"),
        nextProduct: t("products.nextProduct"),
      }}
      skipLinkLabel={t("accessibility.skipToContent")}
      supportingChapterLabels={{
        credibility: {
          sectionLabel: t("credibility.sectionLabel"),
          pendingTitle: t("credibility.pendingTitle"),
          pendingSupport: t("credibility.pendingSupport"),
          metricsLabel: t("credibility.metricsLabel"),
          testimonialsLabel: t("credibility.testimonialsLabel"),
        },
        services: {
          sectionLabel: t("services.sectionLabel"),
          destinationPending: t("services.destinationPending"),
        },
        aegis: {
          sectionLabel: t("aegis.sectionLabel"),
          evidencePending: t("aegis.evidencePending"),
          linkPending: t("aegis.linkPending"),
          linksLabel: t("aegis.linksLabel"),
          copyCode: t("aegis.copyCode"),
          copied: t("aegis.copied"),
          copyFailed: t("aegis.copyFailed"),
          releaseLabel: t("aegis.releaseLabel"),
          licenseLabel: t("aegis.licenseLabel"),
          environmentsLabel: t("aegis.environmentsLabel"),
          sourceLabel: t("aegis.sourceLabel"),
        },
        founder: {
          sectionLabel: t("founder.sectionLabel"),
          profilePending: t("founder.profilePending"),
          portraitPending: t("founder.portraitPending"),
          socialLabel: t("founder.socialLabel"),
          socialPending: t("founder.socialPending"),
        },
        contact: {
          sectionLabel: t("contact.sectionLabel"),
          fields: {
            name: t("form.fields.name"),
            email: t("form.fields.email"),
            message: t("form.fields.message"),
          },
          validation: {
            required: t("form.validation.required"),
            email: t("form.validation.email"),
            summary: t("form.validation.summary"),
          },
          status: {
            submitting: t("status.submitting"),
            success: t("status.success"),
            failure: t("status.failure"),
            timeout: t("status.timeout"),
            unavailable: t("status.unavailable"),
          },
          feedback: {
            copyEmail: t("feedback.copyEmail"),
            emailCopied: t("feedback.emailCopied"),
            copyUnavailable: t("feedback.copyUnavailable"),
            emailPending: t("feedback.emailPending"),
            manualEmailLabel: t("feedback.manualEmailLabel"),
          },
          privacyNotice: t("form.privacyNotice"),
        },
        footer: {
          sectionLabel: t("footer.sectionLabel"),
          tagline: t("footer.tagline"),
          products: t("footer.products"),
          openSource: t("footer.openSource"),
          contact: t("footer.contact"),
          company: t("footer.company"),
          legal: t("footer.legal"),
          founder: t("footer.founder"),
          language: t("footer.language"),
          destinationPending: t("footer.destinationPending"),
          creatorNoticePending: t("footer.creatorNoticePending"),
          developmentStatus: t("footer.developmentStatus"),
        },
      }}
      navigationContent={{
        ariaLabel: t("accessibility.primaryNavigation"),
        openMenuLabel: t("accessibility.openMenu"),
        closeMenuLabel: t("accessibility.closeMenu"),
        homeLabel: "Voynan",
        languageLabel: t("nav.language"),
        localeLabels: { pt: "PT", en: "EN" },
        links: [
          { label: t("nav.products"), sectionId: "products" },
          { label: t("nav.openSource"), sectionId: "aegis" },
          { label: t("nav.buildWithUs"), sectionId: "contact" },
        ],
      }}
    />
  )
}
