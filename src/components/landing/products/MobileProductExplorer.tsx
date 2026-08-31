import { useRef } from "react"

import {
  ProductPanel,
  type ProductPanelLabels,
} from "@/components/landing/products/ProductPanel"
import type { LandingContentDraft, ProductId } from "@/content"
import type { AnalyticsTrack } from "@/lib/analytics"
import { Flip, gsap, useGSAP } from "@/lib/gsap"

type ProductContent = LandingContentDraft["products"]["items"][number]
type FlipState = ReturnType<typeof Flip.getState>

const pendingFlipStates = new WeakMap<HTMLElement, FlipState>()

type MobileProductExplorerLabels = ProductPanelLabels & {
  collapseProduct: string
  developmentShortStatus: string
  mobileGridLabel: string
  mobileInteractionHint: string
  nextProduct: string
  previousProduct: string
  productionShortStatus: string
}

type MobileProductExplorerProps = {
  activeProductId: ProductId | null
  labels: MobileProductExplorerLabels
  onProductSelect: (productId: ProductId | null) => void
  products: ProductContent[]
  reducedMotion: boolean
  trackEvent: AnalyticsTrack
}

export function MobileProductExplorer({
  activeProductId,
  labels,
  onProductSelect,
  products,
  reducedMotion,
  trackEvent,
}: MobileProductExplorerProps) {
  const scopeRef = useRef<HTMLElement>(null)
  const activeIndex = products.findIndex(
    (product) => product.id === activeProductId,
  )
  const activeProduct = activeIndex >= 0 ? products[activeIndex] : null

  const commitSelection = (root: HTMLElement, productId: ProductId | null) => {
    const grid = root.querySelector<HTMLElement>(
      ".mobile-product-explorer__grid",
    )

    if (!reducedMotion && grid) {
      pendingFlipStates.set(
        root,
        Flip.getState(
          grid.querySelectorAll(".mobile-product-explorer__selector"),
        ),
      )
    }

    onProductSelect(productId)
  }

  const { contextSafe } = useGSAP(
    () => {
      if (reducedMotion) {
        if (scopeRef.current) pendingFlipStates.delete(scopeRef.current)
        return
      }

      const flipState = scopeRef.current
        ? pendingFlipStates.get(scopeRef.current)
        : undefined
      if (flipState) {
        Flip.from(flipState, {
          duration: 0.58,
          ease: "power3.inOut",
          simple: true,
          clearProps: "transform",
        })
        if (scopeRef.current) pendingFlipStates.delete(scopeRef.current)
      }

      if (activeProductId) {
        gsap.fromTo(
          ".mobile-product-explorer__panel",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: "power3.out",
            clearProps: "opacity,transform,visibility",
          },
        )
      }
    },
    {
      scope: scopeRef,
      dependencies: [activeProductId, reducedMotion],
      revertOnUpdate: true,
    },
  )

  const selectProduct = contextSafe(
    (root: HTMLElement, productId: ProductId | null) => {
      if (root.dataset.transitioning === "true") return

      const panel = root.querySelector<HTMLElement>(
        ".mobile-product-explorer__panel",
      )
      const changingOpenPanel =
        activeProductId !== null && activeProductId !== productId

      if (!reducedMotion && panel && changingOpenPanel) {
        root.dataset.transitioning = "true"
        gsap.to(panel, {
          autoAlpha: 0,
          y: -12,
          duration: 0.22,
          ease: "power2.in",
          pointerEvents: "none",
          onComplete: () => {
            commitSelection(root, productId)
            delete root.dataset.transitioning
          },
        })
        return
      }

      commitSelection(root, productId)
    },
  )

  const selectAdjacent = (root: HTMLElement, offset: -1 | 1) => {
    const adjacent = products[activeIndex + offset]
    if (adjacent) selectProduct(root, adjacent.id)
  }

  return (
    <section
      ref={scopeRef}
      className="mobile-product-explorer"
      data-expanded={Boolean(activeProduct)}
      data-testid="mobile-product-explorer"
    >
      {!activeProduct ? (
        <p className="mobile-product-explorer__hint">
          <span
            className="mobile-product-explorer__tap-target"
            aria-hidden="true"
          />
          {labels.mobileInteractionHint}
        </p>
      ) : null}

      <div
        className="mobile-product-explorer__grid"
        data-layout={activeProduct ? "compact" : "overview"}
        role="group"
        aria-label={labels.mobileGridLabel}
      >
        {products.map((product, index) => {
          const active = product.id === activeProductId
          const fullStatus =
            product.stage === "production"
              ? labels.productionStatus
              : labels.developmentStatus
          const shortStatus =
            product.stage === "production"
              ? labels.productionShortStatus
              : labels.developmentShortStatus

          return (
            <button
              key={product.id}
              type="button"
              className="mobile-product-explorer__selector"
              data-active={active}
              aria-controls={`mobile-product-${product.id}`}
              aria-expanded={active}
              aria-label={`${product.name}, ${fullStatus}`}
              onClick={(event) =>
                selectProduct(
                  event.currentTarget.closest(".mobile-product-explorer")!,
                  active ? null : product.id,
                )
              }
            >
              <span className="mobile-product-explorer__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{product.name}</strong>
              <small className="mobile-product-explorer__status-full">
                {fullStatus}
              </small>
              <small className="mobile-product-explorer__status-short">
                {shortStatus}
              </small>
              <span className="mobile-product-explorer__summary">
                {product.title}
              </span>
            </button>
          )
        })}
      </div>

      {activeProduct ? (
        <div className="mobile-product-explorer__panel">
          <ProductPanel
            active
            domIdPrefix="mobile-product"
            enhanced={false}
            labels={labels}
            product={activeProduct}
            trackEvent={trackEvent}
          />

          <nav
            className="mobile-product-explorer__controls"
            aria-label={labels.mobileGridLabel}
          >
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={(event) =>
                selectAdjacent(
                  event.currentTarget.closest(".mobile-product-explorer")!,
                  -1,
                )
              }
            >
              <span aria-hidden="true">←</span>
              {labels.previousProduct}
            </button>
            <button
              type="button"
              onClick={(event) =>
                selectProduct(
                  event.currentTarget.closest(".mobile-product-explorer")!,
                  null,
                )
              }
            >
              {labels.collapseProduct}
            </button>
            <button
              type="button"
              disabled={activeIndex === products.length - 1}
              onClick={(event) =>
                selectAdjacent(
                  event.currentTarget.closest(".mobile-product-explorer")!,
                  1,
                )
              }
            >
              {labels.nextProduct}
              <span aria-hidden="true">→</span>
            </button>
          </nav>
        </div>
      ) : null}
    </section>
  )
}

export type { MobileProductExplorerLabels, MobileProductExplorerProps }
