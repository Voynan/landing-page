import { useId } from "react"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import type { LandingContentDraft } from "@/content"
import { track, type AllowedEvent, type AnalyticsTrack } from "@/lib/analytics"

type FooterLink =
  | LandingContentDraft["contact"]["privacyPolicy"]
  | LandingContentDraft["contact"]["social"][number]

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
  creatorNoticePending: string
  developmentStatus: string
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
    const isExternal = /^https?:\/\//.test(item.href)

    return (
      <a
        href={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
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
  const companyGithub = content.contact.social.find(
    (profile) => profile.platform === "github",
  )
  const creatorNoticeApproved =
    content.footer.approval === "approved" &&
    Boolean(content.footer.creatorNotice)

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
                      aria-label={
                        product.stage === "development"
                          ? `${product.name} — ${labels.developmentStatus}`
                          : undefined
                      }
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackEvent({
                          name: "product_click",
                          productId: product.id,
                        })
                      }
                    >
                      <span>{product.name}</span>
                      {product.stage === "development" ? (
                        <small>{labels.developmentStatus}</small>
                      ) : null}
                    </a>
                  ) : (
                    <a
                      href={`#product-${product.id}`}
                      aria-label={
                        product.stage === "development"
                          ? `${product.name} — ${labels.developmentStatus}`
                          : undefined
                      }
                    >
                      <span>{product.name}</span>
                      {product.stage === "development" ? (
                        <small>{labels.developmentStatus}</small>
                      ) : null}
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
              {content.aegis.stage === "released" ? (
                <li>
                  <Destination
                    event={{ name: "aegis_docs_click" }}
                    item={content.aegis.documentation}
                    pendingId={`${pendingId}-docs`}
                    pendingLabel={labels.destinationPending}
                    trackEvent={trackEvent}
                  />
                </li>
              ) : null}
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
              {content.contact.social
                .filter((profile) => profile.platform !== "github")
                .map((profile) => (
                  <li key={profile.platform}>
                    <Destination
                      item={profile}
                      pendingId={`${pendingId}-contact-${profile.platform}`}
                      pendingLabel={labels.destinationPending}
                      trackEvent={trackEvent}
                    />
                  </li>
                ))}
            </ul>
          </nav>

          <nav aria-label={labels.company}>
            <h2>{labels.company}</h2>
            <ul>
              <li>
                <a href="#founder">{labels.founder}</a>
              </li>
              {companyGithub ? (
                <li>
                  <Destination
                    item={companyGithub}
                    pendingId={`${pendingId}-company-github`}
                    pendingLabel={labels.destinationPending}
                    trackEvent={trackEvent}
                  />
                </li>
              ) : null}
            </ul>
          </nav>

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
            {creatorNoticeApproved
              ? content.footer.creatorNotice
              : labels.creatorNoticePending}
          </p>
        </div>
      </div>
    </footer>
  )
}

export type { AtmosphericFooterLabels, AtmosphericFooterProps }
