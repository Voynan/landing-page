import { useId, useRef, type RefObject } from "react"

import { SocialIcon } from "@/components/landing/founder/SocialIcon"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type FounderNoteLabels = {
  sectionLabel: string
  profilePending: string
  portraitPending: string
  socialLabel: string
  socialPending: string
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
        select(
          ".founder-note__portrait-frame, .founder-note__portrait-pending",
        ),
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
  const pendingId = useId()
  const hasApprovedProfile = content.profile.approval === "approved"
  const hasPendingSocial = content.social.some(
    (profile) => profile.approval !== "approved",
  )
  useFounderMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="founder-note landing-chapter"
      aria-labelledby="founder-title"
    >
      <PearlescentStarfield motionId="founder-starfield-drift" variant={6} />

      <div className="landing-chapter__frame">
        <div className="founder-note__layout">
          <div className="founder-note__copy">
            <p className="founder-note__section-label">{labels.sectionLabel}</p>

            {hasApprovedProfile ? (
              <>
                <h2 id="founder-title">{content.profile.name}</h2>
                <p className="founder-note__role">{content.profile.role}</p>
                <p className="founder-note__message">{content.profile.note}</p>
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

            <nav
              className="founder-note__social"
              aria-label={labels.socialLabel}
            >
              {content.social.map((profile) =>
                profile.approval === "approved" ? (
                  <a
                    key={profile.platform}
                    className="founder-note__link"
                    aria-label={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SocialIcon platform={profile.platform} />
                  </a>
                ) : (
                  <span
                    key={profile.platform}
                    className="founder-note__link-pending"
                    role="link"
                    aria-disabled="true"
                    aria-label={profile.label}
                    aria-describedby={pendingId}
                  >
                    <SocialIcon platform={profile.platform} />
                  </span>
                ),
              )}
            </nav>

            {hasPendingSocial ? (
              <small className="founder-note__social-pending" id={pendingId}>
                {labels.socialPending}
              </small>
            ) : null}
          </div>

          {hasApprovedProfile ? (
            <figure className="founder-note__portrait-frame">
              <picture className="founder-note__portrait">
                <img
                  src={content.profile.portraitSrc}
                  alt={content.profile.portraitAlt}
                  width="1024"
                  height="1536"
                  loading="lazy"
                />
              </picture>
            </figure>
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
