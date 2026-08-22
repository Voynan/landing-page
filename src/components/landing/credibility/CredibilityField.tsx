import { useRef, type RefObject } from "react"

import { Testimonial } from "@/components/landing/credibility/Testimonial"
import { VerifiedMetric } from "@/components/landing/credibility/VerifiedMetric"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type CredibilityContent = LandingContentDraft["credibility"]
type ApprovedMetric = Extract<
  CredibilityContent["metrics"][number],
  { approval: "approved" }
>
type ApprovedTestimonial = Extract<
  CredibilityContent["testimonials"][number],
  { approval: "approved" }
>

type CredibilityFieldLabels = {
  sectionLabel: string
  pendingTitle: string
  pendingSupport: string
  metricsLabel: string
  testimonialsLabel: string
}

type CredibilityFieldProps = {
  content: CredibilityContent
  labels: CredibilityFieldLabels
}

function useCredibilityMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const evidence = select(
      ".credibility-field__evidence > *, .credibility-field__pending > *",
    )
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: isMobile ? "top 84%" : "top 70%",
        end: isMobile ? "center 58%" : "bottom 48%",
        scrub: isMobile ? false : profile === "desktop" ? 0.32 : 0.16,
        toggleActions: isMobile ? "play none none reverse" : undefined,
      },
    })

    timeline
      .fromTo(
        select(".credibility-field__title"),
        { opacity: 0, x: isMobile ? 0 : -24, y: isMobile ? 16 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.36, ease: "power2.out" },
      )
      .fromTo(
        evidence,
        { opacity: 0, y: isMobile ? 18 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.16",
      )
  })
}

function isApprovedMetric(
  metric: CredibilityContent["metrics"][number],
): metric is ApprovedMetric {
  return metric.approval === "approved"
}

function isApprovedTestimonial(
  testimonial: CredibilityContent["testimonials"][number],
): testimonial is ApprovedTestimonial {
  return testimonial.approval === "approved"
}

export function CredibilityField({ content, labels }: CredibilityFieldProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const metrics = content.metrics.filter(isApprovedMetric)
  const testimonials = content.testimonials.filter(isApprovedTestimonial)
  const hasEvidence = metrics.length > 0 || testimonials.length > 0
  useCredibilityMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="credibility-field landing-chapter"
      aria-labelledby="credibility-title"
    >
      <div className="landing-chapter__frame">
        <h2 id="credibility-title" className="credibility-field__title">
          {labels.sectionLabel}
        </h2>

        {hasEvidence ? (
          <div className="credibility-field__evidence">
            {metrics.length > 0 ? (
              <div
                className="credibility-field__metrics"
                role="group"
                aria-label={labels.metricsLabel}
              >
                {metrics.map((metric) => (
                  <VerifiedMetric
                    key={`${metric.value}-${metric.definition}`}
                    metric={metric}
                  />
                ))}
              </div>
            ) : null}

            {testimonials.length > 0 ? (
              <div
                className="credibility-field__testimonials"
                role="group"
                aria-label={labels.testimonialsLabel}
              >
                {testimonials.map((testimonial) => (
                  <Testimonial
                    key={`${testimonial.name}-${testimonial.quote}`}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="credibility-field__pending">
            <div className="credibility-field__pending-copy">
              <h3>{labels.pendingTitle}</h3>
              <p>{labels.pendingSupport}</p>
            </div>

            <dl className="credibility-field__ledger">
              <div>
                <dt>{labels.metricsLabel}</dt>
                <dd>0 / {String(content.metrics.length).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>{labels.testimonialsLabel}</dt>
                <dd>
                  0 / {String(content.testimonials.length).padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </section>
  )
}

export type { CredibilityFieldLabels, CredibilityFieldProps }
