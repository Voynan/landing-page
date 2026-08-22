import { useRef, type RefObject } from "react"

import { CapabilityLayer } from "@/components/landing/services/CapabilityLayer"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type BuildWithUsFlowLabels = {
  sectionLabel: string
  destinationPending: string
}

type BuildWithUsFlowProps = {
  content: LandingContentDraft["services"]
  labels: BuildWithUsFlowLabels
}

function useServicesMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: isMobile ? "top 86%" : "top 72%",
        end: isMobile ? "center 60%" : "bottom 44%",
        scrub: isMobile ? false : profile === "desktop" ? 0.38 : 0.18,
        toggleActions: isMobile ? "play none none reverse" : undefined,
      },
    })

    timeline
      .fromTo(
        select(".services-flow__intent, .services-flow__introduction"),
        { opacity: 0, y: isMobile ? 18 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.46,
          ease: "power3.out",
          stagger: 0.08,
        },
      )
      .fromTo(
        select(".capability-layer"),
        { opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 16 : 0 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.54,
          ease: "power2.out",
          stagger: profile === "desktop" ? 0.11 : 0.07,
        },
        "-=0.18",
      )
      .fromTo(
        select(".services-flow__footer"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
        "-=0.16",
      )
  })
}

export function BuildWithUsFlow({ content, labels }: BuildWithUsFlowProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useServicesMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="services-flow landing-chapter"
      aria-labelledby="services-title"
    >
      <div className="landing-chapter__frame">
        <header className="services-flow__header">
          <p className="services-flow__intent">{content.kicker}</p>
          <div className="services-flow__introduction">
            <h2 id="services-title">{content.title}</h2>
            <p>{content.support}</p>
          </div>
        </header>

        <div className="services-flow__layers" aria-label={labels.sectionLabel}>
          {content.layers.map((layer, index) => (
            <CapabilityLayer
              key={layer.title}
              capabilities={layer.capabilities}
              index={index}
              title={layer.title}
            />
          ))}
        </div>

        <footer className="services-flow__footer">
          <span
            className="services-flow__cta"
            role="link"
            aria-disabled="true"
            aria-describedby="services-destination-status"
          >
            {content.cta.label}
          </span>
          <small id="services-destination-status">
            {labels.destinationPending}
          </small>
        </footer>
      </div>
    </section>
  )
}

export type { BuildWithUsFlowLabels, BuildWithUsFlowProps }
