import { useId, useRef, type RefObject } from "react"

import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { gsap } from "@/lib/gsap"

const magneticFilaments = [
  "M-40 226C54 222 54 172 138 170S242 214 318 224",
  "M128 226C214 214 196 112 300 126S398 212 488 226",
  "M322 226C430 202 410 58 548 74S666 204 756 226",
  "M520 226C614 188 626 28 748 52S842 198 940 226",
  "M736 226C822 206 840 80 950 96S1042 204 1138 226",
  "M936 226C1016 208 1044 132 1130 140S1218 210 1308 226",
  "M1150 226C1228 214 1240 164 1320 168S1400 216 1480 226",
] as const

function useSolarCoronaMotion(scope: RefObject<SVGSVGElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const filaments = select("[data-corona-filament]")
    const limb = select("[data-corona-limb]")
    const pulses = select("[data-corona-pulse]")

    const timeline = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      repeat: -1,
      yoyo: true,
      scrollTrigger: {
        id: "thesis-corona-cycle",
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    })

    timeline
      .fromTo(
        filaments,
        { scaleY: 0.92, y: isMobile ? 3 : 6 },
        {
          scaleY: (index) => 1.015 + (index % 3) * 0.018,
          y: (index) => (index % 2 === 0 ? -2 : 1),
          duration: isMobile ? 7.5 : 9.5,
          stagger: { amount: isMobile ? 0.65 : 1.1, from: "center" },
          transformOrigin: "center bottom",
        },
        0,
      )
      .fromTo(
        limb,
        { autoAlpha: 0.58, scaleX: 0.985 },
        {
          autoAlpha: 0.92,
          scaleX: 1,
          duration: isMobile ? 6.5 : 8,
          transformOrigin: "center bottom",
        },
        0.4,
      )
      .fromTo(
        pulses,
        { autoAlpha: 0, strokeDashoffset: 360 },
        {
          autoAlpha: isMobile ? 0.52 : 0.76,
          duration: isMobile ? 5.6 : 4.8,
          ease: "none",
          stagger: 1.2,
          strokeDashoffset: -360,
        },
        1.2,
      )
  })
}

export function SolarCorona() {
  const coronaRef = useRef<SVGSVGElement>(null)
  const gradientId = `solar-corona-${useId().replaceAll(":", "")}`
  useSolarCoronaMotion(coronaRef)

  return (
    <svg
      ref={coronaRef}
      aria-hidden="true"
      className="solar-corona"
      data-testid="solar-corona"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 1440 228"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.12" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="currentColor" />
          <stop offset="0.88" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        className="solar-corona__limb"
        d="M-80 246Q720 112 1520 246"
        data-corona-limb
        stroke={`url(#${gradientId})`}
      />

      <g className="solar-corona__filaments">
        {magneticFilaments.map((path, index) => (
          <path
            key={path}
            className="solar-corona__filament"
            d={path}
            data-corona-filament={index}
            stroke={`url(#${gradientId})`}
          />
        ))}
      </g>

      <g className="solar-corona__pulses">
        <path
          className="solar-corona__pulse"
          d={magneticFilaments[2]}
          data-corona-pulse="primary"
        />
        <path
          className="solar-corona__pulse"
          d={magneticFilaments[4]}
          data-corona-pulse="secondary"
        />
      </g>
    </svg>
  )
}
