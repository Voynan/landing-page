import { useCallback, useEffect, useRef, useState, type RefObject } from "react"

import { ProductChapter } from "@/components/landing/products/ProductChapter"
import { ProgressOrbit } from "@/components/landing/products/ProgressOrbit"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import type { LandingContentDraft, ProductId } from "@/content"
import { useProductVisibility } from "@/hooks/useProductVisibility"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import { gsap, ScrollTrigger } from "@/lib/gsap"

type SaaSStoryStageLabels = {
  sectionLabel: string
  progressLabel: string
  mediaPending: string
  destinationPending: string
}

type SaaSStoryStageProps = {
  labels: SaaSStoryStageLabels
  motionMode: "auto" | "static"
  products: LandingContentDraft["products"]["items"]
  onActiveProductChange?: (productId: ProductId) => void
  trackEvent?: AnalyticsTrack
}

function useProductStoryMotion(
  scope: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useChapterMotion(
    scope,
    ({ profile, root, select }) => {
      const isMobile = profile === "mobile"
      const chapters = gsap.utils.toArray<HTMLElement>(".product-chapter", root)

      chapters.forEach((chapter) => {
        const copy = chapter.querySelector(".product-chapter__copy")
        const media = chapter.querySelector(".product-chapter__media")
        const productId = chapter.dataset.product
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: `product-motion-${productId}`,
            trigger: chapter,
            start: isMobile ? "top 84%" : "top 74%",
            end: isMobile ? "center 60%" : "bottom 46%",
            scrub: isMobile ? false : profile === "desktop" ? 0.35 : 0.18,
            toggleActions: isMobile ? "play none none reverse" : undefined,
          },
        })

        timeline
          .fromTo(
            copy,
            { opacity: 0, x: isMobile ? 0 : -32, y: isMobile ? 18 : 0 },
            { opacity: 1, x: 0, y: 0, duration: 0.5, ease: "power3.out" },
          )
          .fromTo(
            media,
            { opacity: 0, scale: 0.97, x: isMobile ? 0 : 24 },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 0.64,
              ease: "power2.out",
            },
            "-=0.28",
          )
      })

      if (profile === "desktop") {
        const [progress] = select(".product-progress") as HTMLElement[]

        if (progress) {
          ScrollTrigger.create({
            id: "products-progress-pin",
            trigger: root,
            start: "top 96px",
            end: () =>
              `+=${Math.round(Math.min(window.innerHeight * 0.72, 680))}`,
            pin: progress,
            pinSpacing: false,
            anticipatePin: 1,
          })
        }
      }

      if (profile === "desktop") {
        gsap.to(select(".product-progress__orbit"), {
          rotation: 180,
          ease: "none",
          scrollTrigger: {
            id: "products-progress-orbit",
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        })
      }
    },
    { enabled },
  )
}

export function SaaSStoryStage({
  labels,
  motionMode,
  products,
  onActiveProductChange,
  trackEvent = track,
}: SaaSStoryStageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const initialProductId = products[0]?.id ?? "cryptovault"
  const [activeProductId, setActiveProductId] =
    useState<ProductId>(initialProductId)
  const activeProductRef = useRef<ProductId>(initialProductId)
  const lastReportedProductRef = useRef<ProductId | undefined>(undefined)
  const chapterNodes = useRef(new Map<ProductId, HTMLElement>())
  const intersectionRatios = useRef(new Map<ProductId, number>())
  useProductVisibility(activeProductId, trackEvent)
  useProductStoryMotion(sectionRef, motionMode === "auto")
  const activateProduct = useCallback(
    (productId: ProductId) => {
      if (activeProductRef.current !== productId) {
        activeProductRef.current = productId
        setActiveProductId(productId)
      }

      if (
        onActiveProductChange &&
        lastReportedProductRef.current !== productId
      ) {
        lastReportedProductRef.current = productId
        onActiveProductChange(productId)
      }
    },
    [onActiveProductChange],
  )

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    intersectionRatios.current = new Map(
      products.map((product) => [product.id, 0]),
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const productId = entry.target.getAttribute(
            "data-product",
          ) as ProductId | null

          if (productId && intersectionRatios.current.has(productId)) {
            intersectionRatios.current.set(
              productId,
              entry.isIntersecting ? entry.intersectionRatio : 0,
            )
          }
        }

        let productId = activeProductRef.current
        let highestRatio = intersectionRatios.current.get(productId) ?? 0

        for (const product of products) {
          const productRatio = intersectionRatios.current.get(product.id) ?? 0

          if (productRatio > highestRatio) {
            productId = product.id
            highestRatio = productRatio
          }
        }

        if (highestRatio > 0) {
          activateProduct(productId)
        }
      },
      { rootMargin: "-34% 0px -46%", threshold: [0, 0.05, 0.12, 0.2] },
    )

    chapterNodes.current.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [activateProduct, products])

  return (
    <section
      ref={sectionRef}
      id="products"
      className="saas-story-stage"
      data-motion-mode={motionMode}
      aria-label={labels.sectionLabel}
    >
      <div className="saas-story-stage__inner">
        <ProgressOrbit
          activeProductId={activeProductId}
          label={labels.progressLabel}
          productIds={products.map((product) => product.id)}
        />

        <div className="saas-story-stage__chapters">
          {products.map((product) => (
            <ProductChapter
              key={product.id}
              active={product.id === activeProductId}
              articleRef={(node) => {
                if (node) chapterNodes.current.set(product.id, node)
                else chapterNodes.current.delete(product.id)
              }}
              labels={labels}
              onActivate={activateProduct}
              product={product}
              trackEvent={trackEvent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export type { SaaSStoryStageLabels, SaaSStoryStageProps }
