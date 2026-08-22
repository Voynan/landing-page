import type { VerifiedMetric as VerifiedMetricContent } from "@/content/contracts"

type VerifiedMetricProps = {
  metric: VerifiedMetricContent
}

export function VerifiedMetric({ metric }: VerifiedMetricProps) {
  return (
    <article className="verified-metric">
      <strong className="verified-metric__value">{metric.value}</strong>
      <p className="verified-metric__definition">{metric.definition}</p>
      <p className="verified-metric__provenance">
        <span>{metric.period}</span>
        <span aria-hidden="true">·</span>
        <span>{metric.source}</span>
      </p>
    </article>
  )
}

export type { VerifiedMetricProps }
