import { useId } from "react"

import type { EclipseState } from "@/components/motion/eclipseState"

type EclipseThreadProps = {
  className?: string
  reducedMotion?: boolean
  state: EclipseState
}

function layerProps(layer: EclipseState, activeState: EclipseState) {
  const active = layer === activeState

  return {
    "data-active": String(active),
    "data-eclipse-layer": layer,
  }
}

export function EclipseThread({
  className,
  reducedMotion = false,
  state,
}: EclipseThreadProps) {
  const gradientId = `eclipse-thread-${useId().replaceAll(":", "")}`

  return (
    <svg
      aria-hidden="true"
      className={["eclipse-thread", className].filter(Boolean).join(" ")}
      data-motion={reducedMotion ? "static" : "enhanced"}
      data-state={state}
      data-testid="eclipse-thread"
      focusable="false"
      viewBox="0 0 160 160"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.2" stopColor="currentColor" stopOpacity="0.62" />
          <stop offset="0.42" stopColor="currentColor" />
          <stop offset="0.68" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g {...layerProps("ring", state)}>
        <circle className="eclipse-thread__ivory" cx="80" cy="80" r="54" />
        <path
          className="eclipse-thread__accent"
          d="M29 98A54 54 0 0 0 131 98"
          stroke={`url(#${gradientId})`}
        />
      </g>

      <g {...layerProps("line", state)}>
        <path className="eclipse-thread__ivory" d="M80 18V142" />
        <circle className="eclipse-thread__accent-fill" cx="80" cy="80" r="4" />
      </g>

      <g {...layerProps("orbit", state)}>
        <ellipse
          className="eclipse-thread__ivory"
          cx="80"
          cy="80"
          rx="62"
          ry="35"
          transform="rotate(-18 80 80)"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="30"
          cy="91"
          r="3.5"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="83"
          cy="48"
          r="3.5"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="132"
          cy="70"
          r="3.5"
        />
      </g>

      <g {...layerProps("flow", state)}>
        <path
          className="eclipse-thread__ivory"
          d="M18 112C42 112 42 48 66 48S90 112 114 112 132 80 142 80"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="18"
          cy="112"
          r="3.5"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="66"
          cy="48"
          r="3.5"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="114"
          cy="112"
          r="3.5"
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="142"
          cy="80"
          r="3.5"
        />
      </g>

      <g {...layerProps("code", state)}>
        <path
          className="eclipse-thread__ivory"
          d="M52 32L24 80l28 48M108 32l28 48-28 48"
        />
        <path className="eclipse-thread__accent" d="M94 22L66 138" />
      </g>

      <g {...layerProps("signature", state)}>
        <path
          className="eclipse-thread__accent"
          d="M18 104C34 48 44 48 48 94s20 32 28 2c8-32 18-30 18-2 0 24 20 24 48-12"
        />
      </g>

      <g {...layerProps("closing-ring", state)}>
        <circle className="eclipse-thread__ivory" cx="80" cy="80" r="54" />
        <path
          className="eclipse-thread__accent"
          d="M29 98A54 54 0 0 0 131 98"
          stroke={`url(#${gradientId})`}
        />
        <circle
          className="eclipse-thread__accent-fill"
          cx="80"
          cy="134"
          r="3.5"
        />
      </g>
    </svg>
  )
}

export type { EclipseState, EclipseThreadProps }
