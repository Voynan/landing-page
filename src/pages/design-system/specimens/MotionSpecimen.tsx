const motionTokens = [
  ["Hover", "220ms", "State response", "28%"],
  ["Navigation", "400ms", "Local orientation", "46%"],
  ["Reveal", "760ms", "Purposeful entrance", "72%"],
  ["Transform", "1100ms", "Narrative transformation", "100%"],
] as const

export function MotionSpecimen() {
  return (
    <section
      id="motion"
      className="ds-specimen"
      aria-labelledby="motion-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="motion-heading">Motion</h2>
        <p>
          Static content is the default. Motion may explain state or
          transformation later; GSAP and ScrollTrigger remain outside this
          phase.
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
