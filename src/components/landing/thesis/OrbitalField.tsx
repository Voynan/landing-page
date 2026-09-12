import { useId, useRef, type RefObject } from "react"

import {
  useChapterMotion,
  type EnhancedMotionProfile,
} from "@/components/motion/useChapterMotion"
import { gsap } from "@/lib/gsap"

type OrbitalThread = {
  path: string
  /** Dash pattern measured against the normalised 1000-unit path length. */
  flowDash: readonly number[]
  /** Whole dash cycles travelled per loop; an integer keeps the repeat invisible. */
  flowCycles: number
  /** Starting dash phase, so the travelling pulses never line up across the weave. */
  flowPhase: number
  flowOpacity: number
}

const orbitalThreads: readonly OrbitalThread[] = [
  {
    path: "M-120 34C220 14 438 44 654 78C824 104 944 146 1124 116C1280 90 1408 44 1560 54",
    flowDash: [8, 34, 2, 76, 18, 112],
    flowCycles: 3,
    flowPhase: 0,
    flowOpacity: 0.62,
  },
  {
    path: "M-120 66C198 88 418 40 650 56C840 68 936 114 1106 104C1262 94 1390 82 1560 92",
    flowDash: [2, 48, 14, 92, 6, 138],
    flowCycles: 2,
    flowPhase: 96,
    flowOpacity: 0.8,
  },
  {
    path: "M-120 104C220 76 446 108 682 118C850 126 932 70 1110 74C1276 78 1404 126 1560 116",
    flowDash: [8, 34, 2, 76, 18, 112],
    flowCycles: 4,
    flowPhase: 187,
    flowOpacity: 0.7,
  },
  {
    path: "M-120 136C248 160 480 138 702 106C862 82 958 40 1120 56C1284 74 1420 152 1560 148",
    flowDash: [2, 48, 14, 92, 6, 138],
    flowCycles: 3,
    flowPhase: 41,
    flowOpacity: 0.95,
  },
  {
    path: "M-120 172C184 136 448 166 690 154C858 146 948 188 1124 172C1280 158 1408 116 1560 124",
    flowDash: [8, 34, 2, 76, 18, 112],
    flowCycles: 5,
    flowPhase: 268,
    flowOpacity: 0.72,
  },
  {
    path: "M-120 208C218 226 452 186 700 184C862 182 978 122 1140 128C1302 134 1430 200 1560 188",
    flowDash: [2, 48, 14, 92, 6, 138],
    flowCycles: 2,
    flowPhase: 132,
    flowOpacity: 0.84,
  },
  {
    path: "M-120 238C260 208 500 232 730 202C890 180 980 160 1160 190C1320 218 1432 224 1560 206",
    flowDash: [8, 34, 2, 76, 18, 112],
    flowCycles: 4,
    flowPhase: 214,
    flowOpacity: 0.66,
  },
] as const

// The field renders at a uniform scale on every viewport, so a shorter loop on
// the narrower profiles keeps the light travelling at the same speed on screen.
const flowLoopSeconds: Record<EnhancedMotionProfile, number> = {
  desktop: 12,
  tablet: 10.5,
  mobile: 9,
}

function dashPeriodOf(thread: OrbitalThread) {
  return thread.flowDash.reduce((total, segment) => total + segment, 0)
}

function useOrbitalFieldMotion(scope: RefObject<SVGSVGElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const isMobile = profile === "mobile"
    const threads = select("[data-orbital-thread]")
    const flows = select("[data-orbital-flow]")
    let inView = false

    // The weave breathes in and out, so reversing this one reads as the breath.
    const breath = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      paused: true,
      repeat: -1,
      yoyo: true,
    })

    breath.fromTo(
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
    )

    gsap.set(flows, {
      autoAlpha: (index) => orbitalThreads[index].flowOpacity,
      strokeDashoffset: (index) => orbitalThreads[index].flowPhase,
    })

    // The current runs one way at a constant pace. Travelling a whole number of
    // dash cycles lands the repeat on the picture it started from, so the loop
    // never stalls at the end of a pass and never runs backwards.
    const drift = gsap.to(flows, {
      duration: flowLoopSeconds[profile],
      ease: "none",
      repeat: -1,
      strokeDashoffset: (index) => {
        const thread = orbitalThreads[index]
        return thread.flowPhase - dashPeriodOf(thread) * thread.flowCycles
      },
      scrollTrigger: {
        id: "thesis-orbital-drift",
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
        onToggle: ({ isActive }) => {
          inView = isActive
          if (isActive && !document.hidden) breath.play()
          else breath.pause()
        },
      },
    })

    // A hidden tab keeps neither loop running; scroll position decides the rest.
    const holdWhileHidden = () => {
      if (inView && !document.hidden) {
        breath.play()
        drift.resume()
        return
      }

      breath.pause()
      drift.pause()
    }

    document.addEventListener("visibilitychange", holdWhileHidden)

    return () => {
      document.removeEventListener("visibilitychange", holdWhileHidden)
    }
  })
}

export function OrbitalField() {
  const fieldRef = useRef<SVGSVGElement>(null)
  const id = useId().replaceAll(":", "")
  const haloGradientId = `orbital-halo-${id}`
  const coreGradientId = `orbital-core-${id}`
  const flowGradientId = `orbital-flow-${id}`
  const gravityGradientId = `orbital-gravity-${id}`
  useOrbitalFieldMotion(fieldRef)

  return (
    <svg
      ref={fieldRef}
      aria-hidden="true"
      className="orbital-field"
      data-testid="orbital-field"
      focusable="false"
      // Slicing from the bottom edge keeps the authored curvature at every
      // width; a narrow viewport sees a smaller crop of the same weave rather
      // than a horizontally squashed one.
      preserveAspectRatio="xMidYMax slice"
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
        {orbitalThreads.map((thread, index) => (
          <g
            key={thread.path}
            className="orbital-field__thread"
            data-orbital-thread={index}
          >
            {/* The glow sits inside the thread so the breath carries both.
                It is a blurred, offset copy of the halo rather than an SVG
                filter on it: WebKit rasterises filter regions on the CPU and
                redoes the work on every animated frame, which collapsed this
                weave to single-digit frame rates on Safari and mobile. The
                pair carries the halo opacity together, so the blurred and
                sharp strokes still composite as the filter merge did. */}
            <g className="orbital-field__halo-stack">
              <path
                className="orbital-field__glow"
                d={thread.path}
                data-orbital-glow={index}
                stroke={`url(#${haloGradientId})`}
                transform="translate(5 2)"
              />
              <path
                className="orbital-field__halo"
                d={thread.path}
                data-orbital-halo={index}
                stroke={`url(#${haloGradientId})`}
              />
            </g>
            <path
              className="orbital-field__core"
              d={thread.path}
              data-orbital-core={index}
              stroke={`url(#${coreGradientId})`}
            />
            <path
              className="orbital-field__filament"
              d={thread.path}
              data-orbital-filament={index}
              stroke={`url(#${coreGradientId})`}
            />
            <path
              className="orbital-field__flow"
              d={thread.path}
              data-orbital-flow={index}
              pathLength="1000"
              stroke={`url(#${flowGradientId})`}
              strokeDasharray={thread.flowDash.join(" ")}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
