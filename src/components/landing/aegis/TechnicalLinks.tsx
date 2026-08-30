import { useId } from "react"

import type { LandingContentDraft } from "@/content"
import type { AllowedEvent, AnalyticsTrack } from "@/lib/analytics"

type TechnicalLink = LandingContentDraft["aegis"]["github"]

type TechnicalLinksLabels = {
  linkPending: string
  linksLabel: string
}

type TechnicalLinksProps = {
  labels: TechnicalLinksLabels
  links: readonly TechnicalLink[]
  trackEvent: AnalyticsTrack
}

function TechnicalLinkItem({
  labels,
  link,
  event,
  pendingDescriptionId,
  trackEvent,
}: {
  labels: TechnicalLinksLabels
  link: TechnicalLink
  event: AllowedEvent
  pendingDescriptionId: string
  trackEvent: AnalyticsTrack
}) {
  if (link.approval === "approved") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent(event)}
      >
        {link.label}
      </a>
    )
  }

  return (
    <span className="technical-links__pending">
      <span
        role="link"
        aria-disabled="true"
        aria-describedby={pendingDescriptionId}
      >
        {link.label}
      </span>
      <small id={pendingDescriptionId}>{labels.linkPending}</small>
    </span>
  )
}

export function TechnicalLinks({
  labels,
  links,
  trackEvent,
}: TechnicalLinksProps) {
  const pendingDescriptionBaseId = useId()

  return (
    <nav className="technical-links" aria-label={labels.linksLabel}>
      {links.map((link, index) => (
        <TechnicalLinkItem
          key={link.label}
          labels={labels}
          link={link}
          event={
            index === 0
              ? { name: "aegis_github_click" }
              : { name: "aegis_docs_click" }
          }
          pendingDescriptionId={`${pendingDescriptionBaseId}-pending-${index}`}
          trackEvent={trackEvent}
        />
      ))}
    </nav>
  )
}

export type { TechnicalLinksLabels, TechnicalLinksProps }
