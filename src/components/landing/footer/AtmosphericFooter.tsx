import { useId } from "react"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import type { LandingContentDraft, ProductId } from "@/content"
import { track, type AllowedEvent, type AnalyticsTrack } from "@/lib/analytics"

const productNames: Record<ProductId, string> = {
  cryptovault: "CryptoVault",
  investfusion: "InvestFusion",
  constrully: "Constrully",
}

type FooterLink = LandingContentDraft["contact"]["linkedIn"]

type AtmosphericFooterLabels = {
  sectionLabel: string
  tagline: string
  products: string
  openSource: string
  contact: string
  company: string
  legal: string
  founder: string
  language: string
  destinationPending: string
  profilePending: string
  copyrightPending: string
}

type AtmosphericFooterProps = {
  content: LandingContentDraft
  labels: AtmosphericFooterLabels
  trackEvent?: AnalyticsTrack
}

function Destination({
  event,
  item,
  pendingId,
  pendingLabel,
  trackEvent,
}: {
  event?: AllowedEvent
  item: FooterLink
  pendingId: string
  pendingLabel: string
  trackEvent: AnalyticsTrack
}) {
  if (item.approval === "approved") {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => event && trackEvent(event)}
      >
        {item.label}
      </a>
    )
  }

  return (
    <span className="atmospheric-footer__pending">
      <span role="link" aria-disabled="true" aria-describedby={pendingId}>
        {item.label}
      </span>
      <small id={pendingId}>{pendingLabel}</small>
    </span>
  )
}

export function AtmosphericFooter({
  content,
  labels,
  trackEvent = track,
}: AtmosphericFooterProps) {
  const pendingId = useId()
  const founderApproved = content.founder.profile.approval === "approved"
  const founderLinkedInApproved =
    content.founder.linkedIn.approval === "approved"
  const copyrightApproved =
    content.footer.approval === "approved" &&
    Boolean(content.footer.copyrightNotice)

  return (
    <footer className="atmospheric-footer" aria-label={labels.sectionLabel}>
      <div className="atmospheric-footer__atmosphere" aria-hidden="true">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice">
          <circle cx="940" cy="258" r="208" />
          <path d="M0 258H1200" />
          <path d="M940 0V520" />
        </svg>
      </div>

      <div className="atmospheric-footer__frame">
        <div className="atmospheric-footer__masthead">
          <a href="#hero" className="atmospheric-footer__brand">
            <span>Voynan</span>
          </a>
          <p>{labels.tagline}</p>
        </div>

        <div className="atmospheric-footer__ledger">
          <nav aria-label={labels.products}>
            <h2>{labels.products}</h2>
            <ul>
              {content.products.items.map((product) => (
                <li key={product.id}>
                  {product.destination.approval === "approved" ? (
                    <a
                      href={product.destination.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackEvent({
                          name: "product_click",
                          productId: product.id,
                        })
                      }
                    >
                      {productNames[product.id]}
                    </a>
                  ) : (
                    <a href={`#product-${product.id}`}>
                      {productNames[product.id]}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={labels.openSource}>
            <h2>{labels.openSource}</h2>
            <ul>
              <li>
                <a href="#aegis">Aegis</a>
              </li>
              <li>
                <Destination
                  event={{ name: "aegis_github_click" }}
                  item={content.aegis.github}
                  pendingId={`${pendingId}-github`}
                  pendingLabel={labels.destinationPending}
                  trackEvent={trackEvent}
                />
              </li>
              <li>
                <Destination
                  event={{ name: "aegis_docs_click" }}
                  item={content.aegis.documentation}
                  pendingId={`${pendingId}-docs`}
                  pendingLabel={labels.destinationPending}
                  trackEvent={trackEvent}
                />
              </li>
            </ul>
          </nav>

          <nav aria-label={labels.contact}>
            <h2>{labels.contact}</h2>
            <ul>
              <li>
                <a href="#contact">{content.contact.ctaLabel}</a>
              </li>
              <li>
                {content.contact.publicEmail.approval === "approved" ? (
                  <a
                    aria-label={content.contact.publicEmail.label}
                    href={`mailto:${content.contact.publicEmail.address}`}
                  >
                    {content.contact.publicEmail.address}
                  </a>
                ) : (
                  <span className="atmospheric-footer__pending">
                    <span
                      role="link"
                      aria-disabled="true"
                      aria-describedby={`${pendingId}-email`}
                    >
                      {content.contact.publicEmail.label}
                    </span>
                    <small id={`${pendingId}-email`}>
                      {labels.destinationPending}
                    </small>
                  </span>
                )}
              </li>
              <li>
                <Destination
                  item={content.contact.linkedIn}
                  pendingId={`${pendingId}-contact-linkedin`}
                  pendingLabel={labels.destinationPending}
                  trackEvent={trackEvent}
                />
              </li>
            </ul>
          </nav>

          <section aria-labelledby={`${pendingId}-company-heading`}>
            <h2 id={`${pendingId}-company-heading`}>{labels.company}</h2>
            <div
              className="atmospheric-footer__founder"
              aria-label={labels.founder}
            >
              <strong>
                {founderApproved
                  ? content.founder.profile.name
                  : content.founder.profile.role}
              </strong>
              {founderApproved ? (
                <span>{content.founder.profile.role}</span>
              ) : (
                <small>{labels.profilePending}</small>
              )}
              {founderLinkedInApproved ? (
                <a
                  href={content.founder.linkedIn.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.founder.linkedIn.label}
                </a>
              ) : null}
            </div>
          </section>

          <nav aria-label={labels.legal}>
            <h2>{labels.legal}</h2>
            <ul>
              <li>
                <Destination
                  item={content.contact.privacyPolicy}
                  pendingId={`${pendingId}-privacy`}
                  pendingLabel={labels.destinationPending}
                  trackEvent={trackEvent}
                />
              </li>
              <li>
                <Destination
                  item={content.contact.terms}
                  pendingId={`${pendingId}-terms`}
                  pendingLabel={labels.destinationPending}
                  trackEvent={trackEvent}
                />
              </li>
            </ul>
          </nav>

          <section aria-labelledby={`${pendingId}-language-heading`}>
            <h2 id={`${pendingId}-language-heading`}>{labels.language}</h2>
            <LanguageSwitch
              currentLocale={content.locale}
              label={labels.language}
              localeLabels={{ en: "EN", pt: "PT" }}
              trackEvent={trackEvent}
            />
          </section>
        </div>

        <div className="atmospheric-footer__base">
          <p>
            {copyrightApproved
              ? content.footer.copyrightNotice
              : labels.copyrightPending}
          </p>
        </div>
      </div>
    </footer>
  )
}

export type { AtmosphericFooterLabels, AtmosphericFooterProps }
