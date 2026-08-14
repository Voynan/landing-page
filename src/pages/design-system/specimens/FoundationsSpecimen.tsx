import voynanEclipseIcon from "@/assets/brand/voynan.svg"
import voynanWordmark from "@/assets/brand/voynan-wordmark.svg"

const colorTokens = [
  {
    name: "Deep navy",
    cssVar: "--color-navy-deep",
    value: "#090D18",
    role: "Immediate paint and deepest field",
    pairing: "Ivory, slate, copper",
  },
  {
    name: "Structural navy",
    cssVar: "--color-navy",
    value: "#0E1524",
    role: "Primary surface",
    pairing: "Ivory, slate, copper",
  },
  {
    name: "Raised navy",
    cssVar: "--color-navy-raised",
    value: "#16203A",
    role: "Tonal separation",
    pairing: "Ivory, slate",
  },
  {
    name: "Manuscript ivory",
    cssVar: "--color-ivory",
    value: "#F4F1EA",
    role: "Primary foreground",
    pairing: "All navy fields",
  },
  {
    name: "Blue slate",
    cssVar: "--color-slate",
    value: "#8A93A6",
    role: "Secondary foreground",
    pairing: "Deep and structural navy",
  },
  {
    name: "Signature copper",
    cssVar: "--color-copper",
    value: "#C77B3A",
    role: "Single interface accent",
    pairing: "Deep navy text or field",
  },
] as const

const contrastPairings = [
  ["Ivory on deep navy", "17.20:1 · AAA"],
  ["Slate on deep navy", "6.29:1 · AA"],
  ["Copper on deep navy", "5.84:1 · AA"],
  ["Deep navy on copper", "5.84:1 · AA"],
  ["Light copper on deep navy", "8.66:1 · AAA"],
  ["Destructive on deep navy", "8.08:1 · AAA"],
] as const

export function FoundationsSpecimen() {
  return (
    <section
      id="foundations"
      className="ds-specimen"
      aria-labelledby="foundations-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="foundations-heading">Foundations</h2>
        <p>
          Canonical color roles and safe pairings. Product colors stay inside
          approved product media; copper remains the only interface accent.
        </p>
      </header>

      <div className="ds-brand-marks" aria-label="Voynan brand marks">
        <figure className="ds-brand-mark ds-brand-mark--wordmark">
          <div className="ds-brand-mark__stage">
            <img
              src={voynanWordmark}
              alt="Voynan wordmark"
              width="300"
              height="120"
              decoding="async"
            />
          </div>
          <figcaption>
            <strong>Wordmark</strong>
            <span>Primary horizontal signature</span>
            <code>300 × 120 · transparent</code>
          </figcaption>
        </figure>

        <figure className="ds-brand-mark ds-brand-mark--icon">
          <div className="ds-brand-mark__stage">
            <img
              src={voynanEclipseIcon}
              alt="Voynan eclipse icon"
              width="100"
              height="100"
              decoding="async"
            />
          </div>
          <figcaption>
            <strong>Eclipse icon</strong>
            <span>Avatar, favicon, and compact mark</span>
            <code>100 × 100 · transparent</code>
          </figcaption>
        </figure>
      </div>

      <div className="ds-color-strip" aria-label="Voynan color tokens">
        {colorTokens.map((token) => (
          <article className="ds-color-token" key={token.cssVar}>
            <div
              className="ds-color-token__swatch"
              style={{ backgroundColor: `var(${token.cssVar})` }}
              aria-hidden="true"
            />
            <div className="ds-color-token__meta">
              <h3>{token.name}</h3>
              <code>{token.cssVar}</code>
              <dl>
                <div>
                  <dt>Value</dt>
                  <dd>{token.value}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{token.role}</dd>
                </div>
                <div>
                  <dt>Pair with</dt>
                  <dd>{token.pairing}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <dl
        className="ds-compatibility-ledger"
        aria-label="Contrast compatibility"
      >
        {contrastPairings.map(([pairing, result]) => (
          <div key={pairing}>
            <dt>{pairing}</dt>
            <dd>{result}</dd>
          </div>
        ))}
      </dl>

      <div
        className="ds-calibration-ruler"
        role="img"
        aria-label="Calibration ruler"
      >
        {[0, 25, 50, 75, 100].map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    </section>
  )
}
