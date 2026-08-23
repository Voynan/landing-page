import { useRef, type RefObject } from "react"

import voynanEclipse from "@/assets/brand/voynan.svg"
import { CTAGroup } from "@/components/landing/hero/CTAGroup"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft } from "@/content"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import { gsap } from "@/lib/gsap"

type HeroContent = LandingContentDraft["hero"]

type ProductStudioHeroProps = {
  content: HeroContent
  trackEvent?: AnalyticsTrack
}

function useHeroMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, select }) => {
    const travel = profile === "mobile" ? 18 : 28
    const timeline = gsap.timeline({
      defaults: { duration: profile === "mobile" ? 0.48 : 0.72 },
    })

    timeline
      .fromTo(
        select(".landing-hero__eclipse"),
        { opacity: 0, rotation: -8, scale: 0.82 },
        { opacity: 1, rotation: 0, scale: 1, ease: "expo.out" },
      )
      .fromTo(
        select(
          ".landing-hero__content > h1, .landing-hero__support, .landing-cta-group",
        ),
        { opacity: 0, y: travel },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          stagger: profile === "mobile" ? 0.06 : 0.1,
        },
        "-=0.44",
      )
      .fromTo(
        select(".landing-hero__context"),
        { opacity: 0, y: travel * 0.5 },
        { opacity: 1, y: 0, ease: "power2.out" },
        "-=0.32",
      )
  })
}

export function ProductStudioHero({
  content,
  trackEvent = track,
}: ProductStudioHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useHeroMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="landing-hero"
      aria-labelledby="landing-hero-title"
    >
      <PearlescentStarfield motionId="hero-starfield-drift" variant={1} />

      <div className="landing-hero__eclipse" aria-hidden="true">
        <img src={voynanEclipse} alt="" width="100" height="100" />
      </div>

      <div className="landing-hero__content">
        <h1 id="landing-hero-title">{content.title}</h1>
        <p className="landing-hero__support">{content.support}</p>
        <CTAGroup
          actions={[
            {
              href: `#${content.productCta.sectionId}`,
              label: content.productCta.label,
              onClick: () => trackEvent({ name: "hero_product_click" }),
            },
            {
              href: `#${content.contactCta.sectionId}`,
              label: content.contactCta.label,
              onClick: () => trackEvent({ name: "hero_contact_click" }),
              variant: "outline",
            },
          ]}
        />
      </div>

      <div className="landing-hero__context">
        <span>{content.kicker}</span>
        <p>{content.contextLine}</p>
      </div>
    </section>
  )
}

export type { ProductStudioHeroProps }
