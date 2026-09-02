type CapabilityLayerProps = {
  capabilities: string[]
  index: number
  isLast: boolean
  title: string
}

export function CapabilityLayer({
  capabilities,
  index,
  isLast,
  title,
}: CapabilityLayerProps) {
  return (
    <li className="capability-layer" data-service-step={index + 1}>
      <span className="capability-layer__marker" aria-hidden="true">
        {index === 0 ? (
          <span className="capability-layer__connector capability-layer__connector--leading">
            <span className="capability-layer__connector-fill" />
          </span>
        ) : null}
        <span className="capability-layer__node">
          <span className="capability-layer__signal" />
        </span>
        {!isLast ? (
          <span className="capability-layer__connector">
            <span className="capability-layer__connector-fill" />
          </span>
        ) : (
          <span className="capability-layer__connector capability-layer__connector--trailing">
            <span className="capability-layer__connector-fill" />
          </span>
        )}
      </span>

      <div className="capability-layer__content">
        <span className="capability-layer__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{title}</h3>
        <ul>
          {capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export type { CapabilityLayerProps }
