import { ProductEvidence } from "@/components/landing/products/ProductEvidence"
import type { LandingContentDraft } from "@/content"
import type { AnalyticsTrack } from "@/lib/analytics"

type ProductContent = LandingContentDraft["products"]["items"][number]

type ProductPanelLabels = {
  conceptualEvidence: string
  destinationPending: string
  productionStatus: string
  developmentStatus: string
}

type ProductPanelProps = {
  active: boolean
  domIdPrefix?: string
  enhanced: boolean
  labels: ProductPanelLabels
  product: ProductContent
  trackEvent: AnalyticsTrack
}

export function ProductPanel({
  active,
  domIdPrefix = "product",
  enhanced,
  labels,
  product,
  trackEvent,
}: ProductPanelProps) {
  const panelId = `${domIdPrefix}-${product.id}`
  const headingId = `${panelId}-title`
  const status =
    product.stage === "production"
      ? labels.productionStatus
      : labels.developmentStatus
  const inactive = enhanced && !active

  return (
    <article
      id={panelId}
      className="product-panel"
      data-active={active}
      data-product={product.id}
      data-product-stage={product.stage}
      aria-hidden={inactive || undefined}
      aria-labelledby={headingId}
      inert={inactive || undefined}
    >
      <header className="product-panel__intro">
        <div className="product-panel__identity">
          <span>{product.kicker}</span>
          <strong>{product.name}</strong>
          <small>{status}</small>
        </div>

        <h3 id={headingId}>{product.title}</h3>
        <p className="product-panel__support">{product.support}</p>

        {product.destination.approval === "approved" ? (
          <a
            className="product-panel__destination"
            href={product.destination.href}
            onClick={() =>
              trackEvent({ name: "product_click", productId: product.id })
            }
          >
            {product.destination.label}
          </a>
        ) : (
          <span
            className="product-panel__destination product-panel__destination--pending"
            role="link"
            aria-disabled="true"
          >
            <span>{product.destination.label}</span>
            <small>{labels.destinationPending}</small>
          </span>
        )}
      </header>

      <footer className="product-panel__details">
        <ul className="product-panel__capabilities">
          {product.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </footer>

      <div className="product-panel__evidence">
        <ProductEvidence
          product={product}
          conceptualLabel={labels.conceptualEvidence}
          eager={active}
        />
      </div>
    </article>
  )
}

export type { ProductPanelLabels, ProductPanelProps }
