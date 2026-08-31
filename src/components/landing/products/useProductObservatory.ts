import { useCallback, useEffect, useRef, useState } from "react"

import type { ProductId } from "@/content"

const ACTIVE_RATIO_DELTA = 0.08

type UseProductObservatoryOptions = {
  productIds: readonly ProductId[]
  onActiveProductChange?: (productId: ProductId) => void
}

export function useProductObservatory({
  productIds,
  onActiveProductChange,
}: UseProductObservatoryOptions) {
  const initialProductId = productIds[0] ?? "cryptovault"
  const [activeProductId, setActiveProductId] =
    useState<ProductId>(initialProductId)
  const activeProductRef = useRef<ProductId>(initialProductId)
  const onActiveProductChangeRef = useRef(onActiveProductChange)
  const segmentNodes = useRef(new Map<ProductId, HTMLElement>())
  const intersectionRatios = useRef(
    new Map(productIds.map((productId) => [productId, 0])),
  )

  useEffect(() => {
    onActiveProductChangeRef.current = onActiveProductChange
  }, [onActiveProductChange])

  const activateProduct = useCallback((productId: ProductId) => {
    if (activeProductRef.current === productId) return

    activeProductRef.current = productId
    setActiveProductId(productId)
    onActiveProductChangeRef.current?.(productId)
  }, [])

  const segmentRef = useCallback(
    (productId: ProductId) => (node: HTMLElement | null) => {
      if (node) segmentNodes.current.set(productId, node)
      else segmentNodes.current.delete(productId)
    },
    [],
  )

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    intersectionRatios.current = new Map(
      productIds.map((productId) => [productId, 0]),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = entry.target.getAttribute(
            "data-product",
          ) as ProductId
          intersectionRatios.current.set(
            productId,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          )
        })

        const currentProductId = activeProductRef.current
        const currentRatio =
          intersectionRatios.current.get(currentProductId) ?? 0
        const candidateProductId = productIds.reduce(
          (bestProductId, productId) =>
            (intersectionRatios.current.get(productId) ?? 0) >
            (intersectionRatios.current.get(bestProductId) ?? 0)
              ? productId
              : bestProductId,
          currentProductId,
        )
        const candidateRatio =
          intersectionRatios.current.get(candidateProductId) ?? 0

        if (
          candidateProductId !== currentProductId &&
          candidateRatio > 0 &&
          (currentRatio === 0 ||
            candidateRatio >= currentRatio + ACTIVE_RATIO_DELTA)
        ) {
          activateProduct(candidateProductId)
        }
      },
      {
        rootMargin: "-34% 0px -34%",
        threshold: [0, 0.08, 0.16, 0.24, 0.4],
      },
    )

    segmentNodes.current.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [activateProduct, productIds])

  return { activeProductId, activateProduct, segmentRef }
}
