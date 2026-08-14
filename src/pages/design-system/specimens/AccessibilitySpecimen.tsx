import { Button } from "@/components/ui/button"
import { LiveRegion } from "@/components/ui/LiveRegion"

export function AccessibilitySpecimen() {
  return (
    <section
      id="accessibility"
      className="ds-specimen"
      aria-labelledby="accessibility-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="accessibility-heading">Accessibility</h2>
        <p>
          Focus, landmarks, contrast, announcements, and non-color cues are part
          of the visual system rather than a release-only audit.
        </p>
      </header>

      <div className="ds-accessibility-bench">
        <article>
          <h3>Keyboard focus</h3>
          <Button variant="outline">Tab to inspect focus</Button>
          <p>
            A 2px copper-light outline remains offset from the control edge.
          </p>
        </article>
        <article>
          <h3>Contrast pairs</h3>
          <div className="ds-contrast-pair ds-contrast-pair--ivory">
            Ivory on deep navy · AA
          </div>
          <div className="ds-contrast-pair ds-contrast-pair--copper">
            Deep navy on copper · AA
          </div>
        </article>
        <article>
          <h3>Landmark order</h3>
          <ol className="ds-landmark-flow">
            <li>Header</li>
            <li>Local navigation</li>
            <li>Main</li>
            <li>Named sections</li>
          </ol>
        </article>
        <article>
          <h3>Non-color feedback</h3>
          <p>
            <strong>Invalid:</strong> The label and recovery instruction remain
            visible alongside the color treatment.
          </p>
          <LiveRegion message="The accessible status is announced without motion." />
        </article>
      </div>
    </section>
  )
}
