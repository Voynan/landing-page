import { useRef, type RefObject } from "react"

import {
  RealCodeSample,
  type RealCodeSampleLabels,
} from "@/components/landing/aegis/RealCodeSample"
import {
  TechnicalLinks,
  type TechnicalLinksLabels,
} from "@/components/landing/aegis/TechnicalLinks"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import { gsap } from "@/lib/gsap"

type AegisOpenSourceLabels = RealCodeSampleLabels &
  TechnicalLinksLabels & {
    sectionLabel: string
    evidencePending: string
    releaseLabel: string
    licenseLabel: string
    environmentsLabel: string
    sourceLabel: string
  }

type AegisOpenSourceChapterProps = {
  content: LandingContentDraft["aegis"]
  labels: AegisOpenSourceLabels
  trackEvent?: AnalyticsTrack
}

function useAegisMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const calibrationBars = select(".aegis-chapter__calibration span")
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: isMobile ? "top 86%" : "top 72%",
        end: isMobile ? "center 58%" : "bottom 44%",
        scrub: isMobile ? false : profile === "desktop" ? 0.36 : 0.18,
        toggleActions: isMobile ? "play none none reverse" : undefined,
      },
    })

    timeline
      .fromTo(
        select(".aegis-chapter__copy"),
        { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 18 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.52, ease: "power3.out" },
      )
      .fromTo(
        select(".aegis-chapter__evidence"),
        { opacity: 0, scale: 0.97, x: isMobile ? 0 : 26 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.62,
          ease: "power2.out",
        },
        "-=0.28",
      )

    if (calibrationBars.length > 0) {
      timeline.fromTo(
        calibrationBars,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.06,
        },
        "-=0.24",
      )
    }
  })
}

export function AegisOpenSourceChapter({
  content,
  labels,
  trackEvent = track,
}: AegisOpenSourceChapterProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const technicalEvidence = content.technicalEvidence
  const hasApprovedLogo = content.logo.approval === "approved"
  const isDevelopment = content.stage === "development"
  const technicalLinks = isDevelopment
    ? [content.github]
    : [content.github, content.documentation]
  useAegisMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="aegis-chapter landing-chapter"
      aria-labelledby="aegis-title"
    >
      <PearlescentStarfield motionId="aegis-starfield-drift" variant={5} />

      <div className="landing-chapter__frame">
        <div className="aegis-chapter__layout">
          <div className="aegis-chapter__copy">
            <p className="aegis-chapter__status">{content.kicker}</p>
            <h2 id="aegis-title">{content.title}</h2>
            <p className="aegis-chapter__support">{content.support}</p>
            <TechnicalLinks
              labels={labels}
              links={technicalLinks}
              trackEvent={trackEvent}
            />
          </div>

          <div
            className="aegis-chapter__evidence"
            role="group"
            aria-label={labels.sectionLabel}
          >
            {hasApprovedLogo ? (
              <div className="aegis-chapter__brand">
                <div className="aegis-chapter__brand-lockup">
                  <img
                    className="aegis-chapter__logo"
                    src={content.logo.src}
                    alt={content.logo.alt}
                    width={content.logo.width}
                    height={content.logo.height}
                    loading="lazy"
                  />
                  <span className="aegis-chapter__latin-name">AEGIS</span>
                </div>
              </div>
            ) : null}

            {!isDevelopment && technicalEvidence.approval === "approved" ? (
              <div className="aegis-chapter__approved-evidence">
                <dl className="aegis-chapter__metadata">
                  <div>
                    <dt>{labels.releaseLabel}</dt>
                    <dd>{technicalEvidence.releaseStatus}</dd>
                  </div>
                  <div>
                    <dt>{labels.licenseLabel}</dt>
                    <dd>{technicalEvidence.license}</dd>
                  </div>
                  <div>
                    <dt>{labels.environmentsLabel}</dt>
                    <dd>{technicalEvidence.environments.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>{labels.sourceLabel}</dt>
                    <dd>{technicalEvidence.source}</dd>
                  </div>
                </dl>
                <RealCodeSample code={technicalEvidence.code} labels={labels} />
              </div>
            ) : !isDevelopment ? (
              <div className="aegis-chapter__pending">
                <div className="aegis-chapter__calibration" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <p>{labels.evidencePending}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export type { AegisOpenSourceChapterProps, AegisOpenSourceLabels }
