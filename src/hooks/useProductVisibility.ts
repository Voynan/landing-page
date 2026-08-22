import { useEffect } from "react"

import type { ProductId } from "@/content"
import { track, type AllowedEvent } from "@/lib/analytics"

type AnalyticsTrack = (event: AllowedEvent) => unknown

export function useProductVisibility(
  productId: ProductId,
  record: AnalyticsTrack = track,
) {
  useEffect(() => {
    record({ name: "product_view", productId })
  }, [productId, record])
}
