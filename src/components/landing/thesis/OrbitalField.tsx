import { useId, useRef, type RefObject } from "react"

import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { gsap } from "@/lib/gsap"

const orbitalThreads = [
  "M-120 34C220 14 438 44 654 78C824 104 944 146 1124 116C1280 90 1408 44 1560 54",
  "M-120 66C198 88 418 40 650 56C840 68 936 114 1106 104C1262 94 1390 82 1560 92",
  "M-120 104C220 76 446 108 682 118C850 126 932 70 1110 74C1276 78 1404 126 1560 116",
  "M-120 136C248 160 480 138 702 106C862 82 958 40 1120 56C1284 74 1420 152 1560 148",
  "M-120 172C184 136 448 166 690 154C858 146 948 188 1124 172C1280 158 1408 116 1560 124",
  "M-120 208C218 226 452 186 700 184C862 182 978 122 1140 128C1302 134 1430 200 1560 188",
  "M-120 238C260 208 500 232 730 202C890 180 980 160 1160 190C1320 218 1432 224 1560 206",
] as const

function useOrbitalFieldMotion(scope: RefObject<SVGSVGElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const threads = select("[data-orbital-thread]")
    const flows = select("[data-orbital-flow]")

    const timeline = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      repeat: -1,
      yoyo: true,
      scrollTrigger: {
        id: "thesis-orbital-drift",
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    })

    timeline
      .addLabel("orbital-breath", 0)
      .fromTo(
        threads,
        {
          rotation: (index) => (index % 2 === 0 ? -0.2 : 0.25),
          scaleY: (index) => (index % 3 === 0 ? 0.96 : 1.02),
          x: (index) => (index % 2 === 0 ? -12 : 10),
          y: (index) => (index - 3) * -0.7,
        },
        {
          duration: isMobile ? 7.6 : 10.5,
          rotation: (index) => (index % 2 === 0 ? 0.28 : -0.22),
          scaleY: (index) => (index % 3 === 0 ? 1.04 : 0.97),
          stagger: { amount: isMobile ? 0.45 : 0.9, from: "center" },
          x: (index) => (index % 2 === 0 ? 14 : -16),
          y: (index) => (index - 3) * 0.9,
        },
        "orbital-breath",
      )
      .fromTo(
        flows,
        { autoAlpha: 0.18, strokeDashoffset: (index) => index * 138 + 920 },
        {
          autoAlpha: (index) => (index % 3 === 0 ? 0.98 : 0.7),
          duration: isMobile ? 5.8 : 7.4,
          ease: "none",
          stagger: { amount: isMobile ? 1.2 : 2.4, from: "random" },
          strokeDashoffset: (index) => index * -112 - 1080,
        },
        "orbital-breath+=0.2",
      )
  })
}

export function OrbitalField() {
  const fieldRef = useRef<SVGSVGElement>(null)
  const id = useId().replaceAll(":", "")
  const haloGradientId = `orbital-halo-${id}`
  const coreGradientId = `orbital-core-${id}`
  const flowGradientId = `orbital-flow-${id}`
  const gravityGradientId = `orbital-gravity-${id}`
  const glowFilterId = `orbital-glow-${id}`
  useOrbitalFieldMotion(fieldRef)

  return (
    <svg
      ref={fieldRef}
      aria-hidden="true"
      className="orbital-field"
      data-testid="orbital-field"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 1440 252"
    >
      <defs>
        <linearGradient
          id={haloGradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="1440"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="var(--color-ivory)" stopOpacity="0" />
          <stop
            offset="0.18"
            stopColor="var(--color-ivory)"
            stopOpacity="0.2"
          />
          <stop
            offset="0.48"
            stopColor="var(--color-copper)"
            stopOpacity="0.44"
          />
          <stop
            offset="0.7"
            stopColor="var(--color-copper-light)"
            stopOpacity="0.86"
          />
          <stop
            offset="0.82"
            stopColor="var(--color-ivory)"
            stopOpacity="0.22"
          />
          <stop offset="1" stopColor="var(--color-ivory)" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id={coreGradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="1440"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="var(--color-ivory)" stopOpacity="0" />
          <stop
            offset="0.13"
            stopColor="var(--color-ivory)"
            stopOpacity="0.34"
          />
          <stop
            offset="0.46"
            stopColor="var(--color-ivory)"
            stopOpacity="0.76"
          />
          <stop offset="0.64" stopColor="#f78a3c" stopOpacity="1" />
          <stop offset="0.73" stopColor="#ffd6a8" stopOpacity="0.98" />
          <stop
            offset="0.86"
            stopColor="var(--color-ivory)"
            stopOpacity="0.35"
          />
          <stop offset="1" stopColor="var(--color-ivory)" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id={flowGradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="1440"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#fff4e7" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fff4e7" stopOpacity="0.7" />
          <stop offset="0.62" stopColor="#ff6a1a" stopOpacity="1" />
          <stop offset="0.78" stopColor="#fff4e7" stopOpacity="0.88" />
          <stop offset="1" stopColor="#fff4e7" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={gravityGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff9a4d" stopOpacity="0.24" />
          <stop offset="0.32" stopColor="#dc6e25" stopOpacity="0.1" />
          <stop
            offset="0.72"
            stopColor="var(--color-navy)"
            stopOpacity="0.02"
          />
          <stop offset="1" stopColor="var(--color-navy)" stopOpacity="0" />
        </radialGradient>

        <filter
          id={glowFilterId}
          colorInterpolationFilters="sRGB"
          height="180%"
          width="160%"
          x="-30%"
          y="-40%"
        >
          <feGaussianBlur
            in="SourceGraphic"
            result="softGlow"
            stdDeviation="4.8"
          />
          <feOffset dx="5" dy="2" in="softGlow" result="offsetGlow" />
          <feMerge>
            <feMergeNode in="offsetGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="orbital-field__gravity">
        <ellipse
          cx="1040"
          cy="116"
          fill={`url(#${gravityGradientId})`}
          rx="310"
          ry="104"
        />
      </g>

      <g className="orbital-field__weave">
        {orbitalThreads.map((path, index) => (
          <g
            key={path}
            className="orbital-field__thread"
            data-orbital-thread={index}
          >
            <path
              className="orbital-field__halo"
              d={path}
              data-orbital-halo={index}
              filter={`url(#${glowFilterId})`}
              stroke={`url(#${haloGradientId})`}
            />
            <path
              className="orbital-field__core"
              d={path}
              data-orbital-core={index}
              stroke={`url(#${coreGradientId})`}
            />
            <path
              className="orbital-field__filament"
              d={path}
              data-orbital-filament={index}
              stroke={`url(#${coreGradientId})`}
            />
            <path
              className="orbital-field__flow"
              d={path}
              data-orbital-flow={index}
              pathLength="1000"
              stroke={`url(#${flowGradientId})`}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
