import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { MobileProductExplorer } from "@/components/landing/products/MobileProductExplorer"
import { ProductPanel } from "@/components/landing/products/ProductPanel"
import { ProductProgressIndex } from "@/components/landing/products/ProductProgressIndex"
import { useProductObservatory } from "@/components/landing/products/useProductObservatory"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import {
  motionQueries,
  type MotionProfile,
} from "@/components/motion/motionQueries"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft, ProductId } from "@/content"
import { useProductVisibility } from "@/hooks/useProductVisibility"
import { track, type AnalyticsTrack } from "@/lib/analytics"

type SaaSStoryStageLabels = {
  sectionLabel: string
  progressLabel: string
  conceptualEvidence: string
  destinationPending: string
  productionStatus: string
  developmentStatus: string
  productionShortStatus: string
  developmentShortStatus: string
  mobileGridLabel: string
  mobileInteractionHint: string
  collapseProduct: string
  previousProduct: string
  nextProduct: string
}

type SaaSStoryStageProps = {
  content: LandingContentDraft["products"]
  labels: SaaSStoryStageLabels
  motionMode: "auto" | "static"
  onActiveProductChange?: (productId: ProductId) => void
  trackEvent?: AnalyticsTrack
}

function useMobileViewport() {
  const [state, setState] = useState({ matches: false, resolved: false })

  useEffect(() => {
    const query = window.matchMedia(motionQueries.isMobile)
    const update = () => setState({ matches: query.matches, resolved: true })

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return state
}

export function SaaSStoryStage({
  content,
  labels,
  motionMode,
  onActiveProductChange,
  trackEvent = track,
}: SaaSStoryStageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [motionProfile, setMotionProfile] = useState<MotionProfile>("static")
  const [mobileProductId, setMobileProductId] = useState<ProductId | null>(null)
  const mobileViewport = useMobileViewport()
  const orderedProductIds = useMemo(
    () => content.items.map((product) => product.id),
    [content.items],
  )
  const { activeProductId, activateProduct, segmentRef } =
    useProductObservatory({
      productIds: orderedProductIds,
      onActiveProductChange,
    })
  const enhanced = motionMode === "auto" && motionProfile === "desktop"
  const mobilePresentation =
    motionMode === "auto" &&
    (motionProfile === "mobile" ||
      (motionProfile === "reduced" &&
        mobileViewport.resolved &&
        mobileViewport.matches))
  const selectProduct = useCallback(
    (productId: ProductId) => {
      activateProduct(productId)
      const targetId = enhanced
        ? `product-${productId}-segment`
        : `product-${productId}`

      document.getElementById(targetId)?.scrollIntoView({ block: "start" })
    },
    [activateProduct, enhanced],
  )

  const selectMobileProduct = useCallback(
    (productId: ProductId | null) => {
      setMobileProductId(productId)
      if (productId) onActiveProductChange?.(productId)
    },
    [onActiveProductChange],
  )

  useEffect(() => {
    const syncProductFromHash = () => {
      const productId = orderedProductIds.find(
        (candidate) => window.location.hash === `#product-${candidate}`,
      )

      if (!productId) return

      if (mobilePresentation) {
        selectMobileProduct(productId)
        window.requestAnimationFrame(() => {
          document
            .getElementById(`mobile-product-${productId}`)
            ?.scrollIntoView({ block: "start" })
        })
        return
      }

      selectProduct(productId)
    }

    syncProductFromHash()
    window.addEventListener("hashchange", syncProductFromHash)
    return () => window.removeEventListener("hashchange", syncProductFromHash)
  }, [
    mobilePresentation,
    orderedProductIds,
    selectMobileProduct,
    selectProduct,
  ])

  const visibleProductId =
    motionMode === "auto" && motionProfile === "static"
      ? null
      : motionProfile === "reduced" && !mobileViewport.resolved
        ? null
        : mobilePresentation
          ? mobileProductId
          : activeProductId

  useProductVisibility(visibleProductId, trackEvent)
  useChapterMotion(sectionRef, () => undefined, {
    enabled: motionMode === "auto",
    onProfileChange: setMotionProfile,
  })

  return (
    <section
      ref={sectionRef}
      id="products"
      className="saas-story-stage"
      data-motion-mode={motionMode}
      aria-label={labels.sectionLabel}
    >
      <PearlescentStarfield motionId="products-starfield-drift" variant={2} />

      <header className="product-observatory__overture">
        <span>{content.kicker}</span>
        <h2>{content.title}</h2>
        <p>{content.summary}</p>
      </header>

      {mobilePresentation ? (
        <MobileProductExplorer
          activeProductId={mobileProductId}
          labels={labels}
          onProductSelect={selectMobileProduct}
          products={content.items}
          reducedMotion={motionProfile === "reduced"}
          trackEvent={trackEvent}
        />
      ) : (
        <div className="product-observatory">
          <div className="product-observatory__stage">
            <ProductProgressIndex
              activeProductId={activeProductId}
              developmentStatus={labels.developmentStatus}
              label={labels.progressLabel}
              onSelect={selectProduct}
              productionStatus={labels.productionStatus}
              products={content.items}
            />

            <div className="product-observatory__panels">
              {content.items.map((product) => (
                <ProductPanel
                  key={product.id}
                  active={product.id === activeProductId}
                  enhanced={enhanced}
                  labels={labels}
                  product={product}
                  trackEvent={trackEvent}
                />
              ))}
            </div>
          </div>

          <div className="product-observatory__segments" aria-hidden="true">
            {content.items.map((product) => (
              <div
                key={product.id}
                id={`product-${product.id}-segment`}
                ref={segmentRef(product.id)}
                className="product-observatory__segment"
                data-product={product.id}
              />
            ))}
          </div>
        </div>
      )}

      <div className="product-observatory__release">
        <div className="product-observatory__release-rule" aria-hidden="true" />
        <p>{content.closing}</p>
      </div>
    </section>
  )
}

export type { SaaSStoryStageLabels, SaaSStoryStageProps }
