type CapabilityLayerProps = {
  capabilities: string[]
  index: number
  title: string
}

export function CapabilityLayer({
  capabilities,
  index,
  title,
}: CapabilityLayerProps) {
  return (
    <article className="capability-layer">
      <span className="capability-layer__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{title}</h3>
      <ul>
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
    </article>
  )
}

export type { CapabilityLayerProps }
