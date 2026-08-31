import type { LandingContentDraft, ProductId } from "@/content"

type ProductProgressIndexProps = {
  activeProductId: ProductId
  developmentStatus: string
  label: string
  onSelect: (productId: ProductId) => void
  productionStatus: string
  products: LandingContentDraft["products"]["items"]
}

export function ProductProgressIndex({
  activeProductId,
  developmentStatus,
  label,
  onSelect,
  productionStatus,
  products,
}: ProductProgressIndexProps) {
  return (
    <nav className="product-observatory__index" aria-label={label}>
      <ol>
        {products.map((product, index) => {
          const status =
            product.stage === "production"
              ? productionStatus
              : developmentStatus

          return (
            <li key={product.id} data-product-stage={product.stage}>
              <a
                href={`#product-${product.id}-segment`}
                aria-current={
                  product.id === activeProductId ? "step" : undefined
                }
                onClick={(event) => {
                  event.preventDefault()
                  onSelect(product.id)
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{product.name}</strong>
                <small>{status}</small>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export type { ProductProgressIndexProps }
