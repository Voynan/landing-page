import { useId, useRef, type RefObject } from "react"

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

const eclipseAccentArc = "M 12.41 63.68 A 40 40 0 0 0 87.59 63.68"

function HeroEclipse() {
  const id = useId().replaceAll(":", "")
  const accentGradientId = `hero-eclipse-accent-${id}`
  const ringGlowFilterId = `hero-eclipse-ring-glow-${id}`

  return (
    <svg
      aria-hidden="true"
      className="hero-eclipse"
      data-testid="hero-eclipse"
      focusable="false"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient
          id={accentGradientId}
          gradientUnits="userSpaceOnUse"
          x1="12.41"
          x2="87.59"
          y1="50"
          y2="50"
        >
          <stop offset="0" stopColor="var(--color-ivory)" stopOpacity="0" />
          <stop
            offset="0.18"
            stopColor="var(--color-copper-light)"
            stopOpacity="0.55"
          />
          <stop offset="0.38" stopColor="var(--color-copper)" stopOpacity="1" />
          <stop offset="0.62" stopColor="var(--color-copper)" stopOpacity="1" />
          <stop
            offset="0.82"
            stopColor="var(--color-copper-light)"
            stopOpacity="0.55"
          />
          <stop offset="1" stopColor="var(--color-ivory)" stopOpacity="0" />
        </linearGradient>

        <filter
          id={ringGlowFilterId}
          colorInterpolationFilters="sRGB"
          height="160%"
          width="160%"
          x="-30%"
          y="-30%"
        >
          <feGaussianBlur
            in="SourceGraphic"
            result="ringGlow"
            stdDeviation="2.6"
          />
          <feOffset dx="1.2" dy="1" in="ringGlow" result="offsetGlow" />
          <feMerge>
            <feMergeNode in="offsetGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        className="hero-eclipse__ring-glow"
        cx="50"
        cy="50"
        data-eclipse-glow="ring"
        filter={`url(#${ringGlowFilterId})`}
        r="40"
      />
      <circle className="hero-eclipse__base" cx="50" cy="50" r="40" />

      <path
        className="hero-eclipse__accent"
        d={eclipseAccentArc}
        data-eclipse-accent="orange"
        stroke={`url(#${accentGradientId})`}
      />
    </svg>
  )
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
        <HeroEclipse />
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
