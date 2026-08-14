export function ContentStressSpecimen() {
  return (
    <section
      id="content-stress"
      className="ds-specimen"
      aria-labelledby="content-stress-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="content-stress-heading">Content stress</h2>
        <p>
          Long bilingual copy, uninterrupted strings, URLs, and recovery
          messages must wrap at 200% zoom without horizontal page overflow.
        </p>
      </header>

      <div className="ds-stress-grid">
        <article lang="pt-BR">
          <h3>
            Produtos digitais construídos para continuar evoluindo depois do
            lançamento
          </h3>
          <p>
            Responsabilidade técnica contínua exige clareza suficiente para
            atravessar mudanças de produto, operação e contexto.
          </p>
        </article>
        <article lang="en">
          <h3>
            Digital products designed to remain understandable as teams and
            requirements change
          </h3>
          <p>
            Long-form editorial copy keeps a readable measure while preserving
            every action and section boundary.
          </p>
        </article>
        <article>
          <h3>Wrapping pressure</h3>
          <p className="ds-break-anywhere">
            hiperresponsabilizaçãotécnicacontínuainterdisciplinar
          </p>
          <a
            className="ds-break-anywhere"
            href="https://voynan.local/design-system/content-stress"
          >
            https://voynan.local/design-system/content-stress/very-long-diagnostic-path
          </a>
        </article>
        <article aria-label="Error recovery example">
          <h3>Recovery message</h3>
          <p role="alert">
            The preview could not load. Keep the current values and try the
            preview again.
          </p>
        </article>
      </div>
    </section>
  )
}
