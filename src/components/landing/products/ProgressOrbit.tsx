import type { ProductId } from "@/content"

const productNames: Record<ProductId, string> = {
  cryptovault: "CryptoVault",
  investfusion: "InvestFusion",
  constrully: "Constrully",
}

type ProgressOrbitProps = {
  activeProductId: ProductId
  label: string
  productIds: readonly ProductId[]
}

export function ProgressOrbit({
  activeProductId,
  label,
  productIds,
}: ProgressOrbitProps) {
  return (
    <div className="product-progress" aria-hidden="false">
      <div className="product-progress__orbit" aria-hidden="true" />
      <ol aria-label={label}>
        {productIds.map((productId, index) => (
          <li
            key={productId}
            data-product={productId}
            aria-current={productId === activeProductId ? "step" : undefined}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <strong>{productNames[productId]}</strong>
          </li>
        ))}
      </ol>
    </div>
  )
}

export type { ProgressOrbitProps }
