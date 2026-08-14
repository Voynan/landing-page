const spacingTokens = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const

export function LayoutSpecimen() {
  return (
    <section
      id="layout"
      className="ds-specimen"
      aria-labelledby="layout-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="layout-heading">Layout</h2>
        <p>
          The public system caps content at 1180px and changes from 12 to 8 to 4
          conceptual columns without changing reading order.
        </p>
      </header>

      <div className="ds-layout-bench">
        <div className="ds-layout-grid" aria-label="Twelve column desktop grid">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} aria-hidden="true">
              {index + 1}
            </span>
          ))}
        </div>

        <dl className="ds-breakpoints">
          <div>
            <dt>Desktop</dt>
            <dd>12 columns · 48px pad · 1180px max</dd>
          </div>
          <div>
            <dt>Tablet ≤980px</dt>
            <dd>8 columns · 28px pad</dd>
          </div>
          <div>
            <dt>Mobile ≤560px</dt>
            <dd>4 columns · 20px pad</dd>
          </div>
        </dl>

        <div className="ds-spacing-scale" aria-label="Spacing scale">
          {spacingTokens.map((space) => (
            <div key={space}>
              <span style={{ blockSize: `${space}px` }} aria-hidden="true" />
              <code>{space}px</code>
            </div>
          ))}
        </div>

        <div className="ds-radius-scale" aria-label="Radius scale">
          <span className="ds-radius-scale__sample ds-radius-scale__sample--sm">
            2px control
          </span>
          <span className="ds-radius-scale__sample ds-radius-scale__sample--md">
            4px technical
          </span>
        </div>
      </div>
    </section>
  )
}
