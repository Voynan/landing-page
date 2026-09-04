import { useRef, useState } from "react"

import { EclipseThread } from "@/components/motion/EclipseThread"
import {
  eclipseStates,
  type EclipseState,
} from "@/components/motion/eclipseState"
import { gsap, useGSAP } from "@/lib/gsap"

const motionTokens = [
  ["Hover", "220ms", "State response", "28%"],
  ["Navigation", "400ms", "Local orientation", "46%"],
  ["Reveal", "760ms", "Purposeful entrance", "72%"],
  ["Transform", "1100ms", "Narrative transformation", "100%"],
] as const

const eclipseStateLabels: Record<EclipseState, string> = {
  ring: "Ring",
  line: "Line",
  orbit: "Orbit",
  flow: "Flow",
  code: "Code",
  signature: "Signature",
  "closing-ring": "Closing ring",
}

export function MotionSpecimen() {
  const previewRef = useRef<HTMLDivElement>(null)
  const [selectedState, setSelectedState] = useState<EclipseState>("ring")
  const [replay, setReplay] = useState(0)

  useGSAP(
    () => {
      const preview = previewRef.current
      if (!preview) return

      const matchMedia = gsap.matchMedia()
      matchMedia.add(
        { canAnimate: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          if (!context.conditions?.canAnimate) return

          const layer = preview.querySelector(
            `[data-eclipse-layer="${selectedState}"]`,
          )
          if (!layer) return

          gsap.fromTo(
            layer,
            { opacity: 0, rotation: -5, scale: 0.84 },
            {
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 0.76,
              ease: "expo.out",
            },
          )
        },
        preview,
      )

      return () => matchMedia.revert()
    },
    {
      dependencies: [replay, selectedState],
      revertOnUpdate: true,
      scope: previewRef,
    },
  )

  return (
    <section
      id="motion"
      className="ds-specimen"
      aria-labelledby="motion-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="motion-heading">Motion</h2>
        <p>
          Static content remains the default. GSAP adds a restrained eclipse
          narrative while every chapter preserves its content, order, and
          actions without animation.
        </p>
      </header>

      <div className="ds-motion-bench">
        {motionTokens.map(([name, duration, purpose, distance]) => (
          <article key={name}>
            <h3>{name}</h3>
            <code>{duration}</code>
            <p>{purpose}</p>
            <span className="ds-motion-track" aria-hidden="true">
              <span
                style={{
                  inlineSize: distance,
                }}
              />
            </span>
          </article>
        ))}
      </div>

      <div className="ds-eclipse-specimen">
        <header className="ds-eclipse-specimen__header">
          <div>
            <p className="ds-kicker">Narrative states</p>
            <h3>Eclipse thread</h3>
          </div>
          <p>
            Eight SVG states move with the landing argument. This specimen stays
            in normal document flow and never creates a scroll pin.
          </p>
        </header>

        <ul
          className="ds-eclipse-state-grid"
          aria-label="Eclipse thread states"
        >
          {eclipseStates.map((state, index) => (
            <li key={state}>
              <span>
                {String(index + 1).padStart(2, "0")} ·{" "}
                {eclipseStateLabels[state]}
              </span>
              <EclipseThread reducedMotion state={state} />
            </li>
          ))}
        </ul>

        <div
          className="ds-eclipse-controls"
          role="group"
          aria-label="Eclipse state controls"
        >
          {eclipseStates.map((state) => (
            <button
              key={state}
              type="button"
              aria-pressed={selectedState === state}
              onClick={() => {
                setSelectedState(state)
                setReplay(0)
              }}
            >
              {eclipseStateLabels[state]}
            </button>
          ))}
        </div>

        <div
          className="ds-motion-comparison"
          role="group"
          aria-label="Motion comparison"
        >
          <article>
            <header>
              <div>
                <span>Standard motion</span>
                <small>GSAP · 760ms · expo.out</small>
              </div>
              <button
                type="button"
                onClick={() => setReplay((current) => current + 1)}
              >
                Replay selected state
              </button>
            </header>
            <div
              ref={previewRef}
              className="ds-motion-comparison__stage"
              data-replay={replay}
              data-testid="motion-standard-preview"
            >
              <EclipseThread state={selectedState} />
            </div>
          </article>

          <article>
            <header>
              <div>
                <span>Reduced motion</span>
                <small>Final state · no scrub</small>
              </div>
            </header>
            <div className="ds-motion-comparison__stage">
              <EclipseThread reducedMotion state={selectedState} />
            </div>
          </article>
        </div>
      </div>

      <dl className="ds-motion-easing" aria-label="Motion easing tokens">
        <div>
          <dt>
            <code>--ease-standard</code>
          </dt>
          <dd>
            <code>cubic-bezier(0.4, 0, 0.2, 1)</code>
          </dd>
        </div>
        <div>
          <dt>
            <code>--ease-enter</code>
          </dt>
          <dd>
            <code>cubic-bezier(0.22, 1, 0.36, 1)</code>
          </dd>
        </div>
      </dl>

      <p className="ds-static-contract" data-motion="reveal">
        Reduced motion exposes this final state immediately and preserves the
        same content, order, and actions.
      </p>
    </section>
  )
}
