import { AppProviders } from "@/app/AppProviders"
import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { SkipLink } from "@/components/ui/SkipLink"
import {
  getLegalDocument,
  legalPaths,
  type LegalDocumentKind,
} from "@/content/legal"
import type { Locale } from "@/content"

type LegalDocumentPageProps = {
  locale: Locale
  kind: LegalDocumentKind
}

export function LegalDocumentPage({ locale, kind }: LegalDocumentPageProps) {
  const document = getLegalDocument(locale, kind)
  const homeHref = `/${locale}`
  const privacyHref = legalPaths.privacy[locale]
  const termsHref = legalPaths.terms[locale]
  const skipLabel =
    locale === "pt" ? "Pular para o conteúdo" : "Skip to content"

  return (
    <AppProviders locale={locale}>
      <div className="legal-page">
        <SkipLink targetId="legal-content">{skipLabel}</SkipLink>

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
              currentLocale={locale}
              label={document.languageLabel}
              localeHrefs={legalPaths[kind]}
              localeLabels={{ pt: "PT", en: "EN" }}
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
            <p>
              {locale === "pt"
                ? "Todos os produtos e serviços apresentados são criados e mantidos por Voynan."
                : "All featured products and services are created and maintained by Voynan."}
            </p>
            <nav aria-label="Legal">
              <a href={privacyHref}>
                {locale === "pt" ? "Privacidade" : "Privacy"}
              </a>
              <a href={termsHref}>{locale === "pt" ? "Termos" : "Terms"}</a>
              <a href="mailto:contact@voynan.com">{document.contactLabel}</a>
            </nav>
          </div>
        </footer>
      </div>
    </AppProviders>
  )
}
