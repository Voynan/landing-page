import { useRef, type RefObject } from "react"

import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { OrbitalField } from "@/components/landing/thesis/OrbitalField"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type StudioThesisProps = {
  content: LandingContentDraft["thesis"]
}

function useThesisMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: isMobile ? "top 82%" : "top 72%",
        end: isMobile ? "center 58%" : "bottom 48%",
        scrub: isMobile ? false : profile === "desktop" ? 0.4 : 0.2,
        toggleActions: isMobile ? "play none none reverse" : undefined,
      },
    })

    timeline
      .fromTo(
        select(".landing-thesis__rule"),
        isMobile ? { scaleX: 0 } : { scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.34,
          ease: "power2.out",
          transformOrigin: isMobile ? "left center" : "center top",
        },
      )
      .fromTo(
        select("h2"),
        { opacity: 0, y: isMobile ? 20 : 34 },
        { opacity: 1, y: 0, duration: 0.66, ease: "power3.out" },
        "-=0.12",
      )
  })
}

export function StudioThesis({ content }: StudioThesisProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useThesisMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="landing-thesis"
      aria-labelledby="landing-thesis-title"
    >
      <PearlescentStarfield motionId="thesis-starfield-drift" />
      <div className="landing-thesis__inner">
        <div className="landing-thesis__rule" aria-hidden="true" />
        <h2 id="landing-thesis-title">{content.statement}</h2>
      </div>
      <OrbitalField />
    </section>
  )
}

export type { StudioThesisProps }
