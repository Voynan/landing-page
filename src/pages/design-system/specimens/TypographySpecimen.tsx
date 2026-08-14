const typeRoles = [
  [
    "Hero",
    "--text-hero",
    "300",
    "0.98",
    "Produtos digitais que continuam evoluindo",
  ],
  [
    "Statement",
    "--text-statement",
    "300",
    "1.12",
    "Responsabilidade além do lançamento",
  ],
  ["H2", "--text-h2", "300", "1.03", "Software sob demanda"],
  ["H3", "--text-h3", "300", "1.15", "CryptoVault"],
  ["Statistic", "--text-statistic", "300", "1", "Dados verificados"],
  [
    "Body",
    "--text-body",
    "400",
    "1.6",
    "Built to launch, operate, and keep evolving.",
  ],
  ["Kicker", "--text-kicker", "500", "1.5", "TECHNICAL IDENTIFIER"],
  ["Code", "--text-code", "400", "1.6", "encrypt(file, authenticatedKey)"],
] as const

export function TypographySpecimen() {
  return (
    <section
      id="typography"
      className="ds-specimen"
      aria-labelledby="typography-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="typography-heading">Typography</h2>
        <p>
          Poppins carries editorial hierarchy at weights 300, 400, and 500.
          JetBrains Mono is reserved for code, values, and technical
          identifiers.
        </p>
      </header>

      <div className="ds-type-ramp">
        {typeRoles.map(([role, token, weight, lineHeight, sample]) => (
          <article className="ds-type-role" key={role}>
            <div className="ds-type-role__meta">
              <h3>{role}</h3>
              <code>{token}</code>
              <span>
                {weight} / {lineHeight}
              </span>
            </div>
            <p
              className={
                role === "Code"
                  ? "ds-type-role__sample ds-type-role__sample--code"
                  : "ds-type-role__sample"
              }
              style={{ fontSize: `var(${token})`, lineHeight }}
            >
              {sample}
            </p>
          </article>
        ))}
      </div>

      <p className="ds-inline-link-demo">
        Links remain identifiable in context:{" "}
        <a href="#controls">inspect production controls</a>.
      </p>
    </section>
  )
}
