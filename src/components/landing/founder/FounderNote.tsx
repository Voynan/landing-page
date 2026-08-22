import { useRef, type RefObject } from "react"

import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type FounderNoteLabels = {
  sectionLabel: string
  profilePending: string
  portraitPending: string
  linkedInPending: string
}

type FounderNoteProps = {
  content: LandingContentDraft["founder"]
  labels: FounderNoteLabels
}

function useFounderMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: isMobile ? "top 86%" : "top 72%",
        end: isMobile ? "center 58%" : "bottom 46%",
        scrub: isMobile ? false : profile === "desktop" ? 0.34 : 0.16,
        toggleActions: isMobile ? "play none none reverse" : undefined,
      },
    })

    timeline
      .fromTo(
        select(".founder-note__copy"),
        { opacity: 0, y: isMobile ? 18 : 30 },
        { opacity: 1, y: 0, duration: 0.54, ease: "power3.out" },
      )
      .fromTo(
        select(".founder-note__portrait, .founder-note__portrait-pending"),
        { opacity: 0, rotation: isMobile ? 0 : 1.5, scale: 0.97 },
        {
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.62,
          ease: "power2.out",
        },
        "-=0.28",
      )
  })
}

export function FounderNote({ content, labels }: FounderNoteProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const hasApprovedProfile = content.profile.approval === "approved"
  const hasApprovedLinkedIn = content.linkedIn.approval === "approved"
  useFounderMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="founder-note landing-chapter"
      aria-labelledby="founder-title"
    >
      <div className="landing-chapter__frame">
        <div className="founder-note__layout">
          <div className="founder-note__copy">
            <p className="founder-note__section-label">{labels.sectionLabel}</p>

            {hasApprovedProfile ? (
              <>
                <h2 id="founder-title">{content.profile.name}</h2>
                <p className="founder-note__role">{content.profile.role}</p>
                <p className="founder-note__message">{content.profile.note}</p>
                <small>{content.profile.source}</small>
              </>
            ) : (
              <>
                <h2 id="founder-title">{content.profile.role}</h2>
                <p className="founder-note__message">{labels.profilePending}</p>
                <span className="founder-note__portrait-status">
                  {labels.portraitPending}
                </span>
              </>
            )}

            {hasApprovedLinkedIn ? (
              <a
                className="founder-note__link"
                href={content.linkedIn.href}
                target="_blank"
                rel="noreferrer"
              >
                {content.linkedIn.label}
              </a>
            ) : (
              <span className="founder-note__link-pending">
                <span role="link" aria-disabled="true">
                  {content.linkedIn.label}
                </span>
                <small>{labels.linkedInPending}</small>
              </span>
            )}
          </div>

          {hasApprovedProfile ? (
            <picture className="founder-note__portrait">
              <img
                src={content.profile.portraitSrc}
                alt={content.profile.portraitAlt}
                width="720"
                height="900"
                loading="lazy"
              />
            </picture>
          ) : (
            <div
              className="founder-note__portrait-pending"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export type { FounderNoteLabels, FounderNoteProps }
