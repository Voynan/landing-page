import { useLocale } from "@/app/localeContext"
import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { SkipLink } from "@/components/ui/SkipLink"
import {
  getLegalDocument,
  legalPaths,
  type LegalDocumentKind,
} from "@/content/legal"
import { useTranslation } from "react-i18next"

type LegalDocumentPageProps = {
  kind: LegalDocumentKind
}

export function LegalDocumentPage({ kind }: LegalDocumentPageProps) {
  const { locale } = useLocale()
  const { t } = useTranslation()
  const document = getLegalDocument(locale, kind)
  const homeHref = "/"
  const privacyHref = legalPaths.privacy
  const termsHref = legalPaths.terms

  return (
    <div className="legal-page">
      <SkipLink targetId="legal-content">
        {t("accessibility.skipToContent")}
      </SkipLink>

      <header className="legal-header">
        <div className="legal-header__frame">
          <a className="legal-header__back" href={homeHref}>
            <span aria-hidden="true">←</span>
            <span>{document.backLabel}</span>
          </a>
          <a className="legal-header__brand" href={homeHref}>
            Voynan
          </a>
          <LanguageSwitch
            label={document.languageLabel}
            localeLabels={{ pt: "PT", en: "EN" }}
            path={legalPaths[kind]}
          />
        </div>
      </header>

      <main id="legal-content" className="legal-document">
        <header className="legal-document__intro">
          <h1>{document.title}</h1>
          <p className="legal-document__summary">{document.summary}</p>
          <p className="legal-document__updated">
            {document.updatedLabel}: <time>{document.updatedDate}</time>
          </p>
        </header>

        <div className="legal-document__layout">
          <aside className="legal-document__aside">
            <nav aria-label={document.contentsLabel}>
              <h2>{document.contentsLabel}</h2>
              <ol>
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="legal-document__body">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="legal-footer__frame">
          <p>{t("legal.creatorNotice")}</p>
          <nav aria-label="Legal">
            <a href={privacyHref}>{t("legal.privacy")}</a>
            <a href={termsHref}>{t("legal.terms")}</a>
            <a href="mailto:contact@voynan.com">{document.contactLabel}</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
