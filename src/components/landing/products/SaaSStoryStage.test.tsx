// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SaaSStoryStage } from "@/components/landing/products/SaaSStoryStage"
import { motionQueries } from "@/components/motion/motionQueries"
import { getLandingContent, type LandingContentDraft } from "@/content"
import type { AllowedEvent } from "@/lib/analytics"
import { ScrollTrigger } from "@/lib/gsap"

const labels = {
  sectionLabel: "Produtos",
  progressLabel: "Capítulos dos produtos",
  mediaPending: "Mídia aguardando captura aprovada",
  destinationPending: "Destino aguardando aprovação",
} as const

const approvedProducts = getLandingContent("pt").products.items.map(
  (product, index) => ({
    ...product,
    destination: {
      label: product.destination.label,
      href: `https://example.com/product-${index + 1}`,
      approval: "approved" as const,
    },
    media: {
      desktopSrc: `/media/product-${index + 1}-desktop.webp`,
      mobileSrc: `/media/product-${index + 1}-mobile.webp`,
      posterSrc: `/media/product-${index + 1}-poster.webp`,
      width: 1600,
      height: 900,
      alt: `Captura aprovada do produto ${index + 1}`,
      source: "Product owner",
      approval: "approved" as const,
    },
  }),
) as LandingContentDraft["products"]["items"]

function installMotionProfile(profile: "desktop" | "tablet" | "mobile") {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        (profile === "desktop" && query === motionQueries.isDesktop) ||
        (profile === "tablet" && query === motionQueries.isTablet) ||
        (profile === "mobile" && query === motionQueries.isMobile),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })),
  )
}

afterEach(() => {
  cleanup()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
})

describe("SaaSStoryStage", () => {
  it("keeps the three pending products equal, ordered, and complete", () => {
    render(
      <SaaSStoryStage
        labels={labels}
        motionMode="static"
        products={getLandingContent("pt").products.items}
      />,
    )

    const articles = screen.getAllByRole("article")

    expect(articles).toHaveLength(3)
    expect(
      articles.map(
        (article) =>
          within(article).getByRole("heading", { level: 2 }).textContent,
      ),
    ).toEqual([
      "Proteja arquivos. Comprove sua integridade.",
      "Seus investimentos, além da planilha.",
      "Cada custo da obra, sob controle.",
    ])

    for (const article of articles) {
      expect(within(article).getAllByRole("listitem")).toHaveLength(3)
      expect(within(article).getByText(labels.mediaPending)).toBeInTheDocument()
      expect(
        within(article).getByRole("link", { name: /Conhecer/ }),
      ).toHaveAttribute("aria-disabled", "true")
      expect(article).not.toHaveAttribute("data-priority")
    }
  })

  it("uses approved destinations and media without changing product weight", () => {
    render(
      <SaaSStoryStage
        labels={labels}
        motionMode="static"
        products={approvedProducts}
      />,
    )

    expect(screen.getAllByRole("link", { name: /Conhecer/ })).toHaveLength(3)
    expect(
      screen.getAllByRole("img", { name: /Captura aprovada/ }),
    ).toHaveLength(3)
    expect(screen.queryByText(labels.mediaPending)).not.toBeInTheDocument()
  })

  it("reports product visibility and approved destination outcomes", async () => {
    const user = userEvent.setup()
    const events: AllowedEvent[] = []

    render(
      <SaaSStoryStage
        labels={labels}
        motionMode="static"
        products={approvedProducts}
        trackEvent={(event) => events.push(event)}
      />,
    )

    await user.click(screen.getAllByRole("link", { name: /Conhecer/ })[1])

    expect(events).toEqual([
      { name: "product_view", productId: "cryptovault" },
      { name: "product_view", productId: "investfusion" },
      { name: "product_click", productId: "investfusion" },
    ])
  })

  it("reports a product becoming active without turning progress into navigation", () => {
    const onActiveProductChange = vi.fn()

    render(
      <SaaSStoryStage
        labels={labels}
        motionMode="static"
        products={getLandingContent("pt").products.items}
        onActiveProductChange={onActiveProductChange}
      />,
    )

    fireEvent.pointerEnter(screen.getAllByRole("article")[1])

    expect(onActiveProductChange).toHaveBeenCalledWith("investfusion")
    expect(
      within(screen.getByRole("list", { name: labels.progressLabel }))
        .getByText("InvestFusion")
        .closest("li"),
    ).toHaveAttribute("aria-current", "step")
    expect(
      screen.queryByRole("navigation", { name: labels.progressLabel }),
    ).not.toBeInTheDocument()
  })

  it("reports the first visible product and keeps the dominant chapter active", () => {
    let notifyIntersection: IntersectionObserverCallback = () => undefined
    const observe = vi.fn()

    class ReadingLineObserver {
      constructor(callback: IntersectionObserverCallback) {
        notifyIntersection = callback
      }

      observe = observe
      disconnect = vi.fn()
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
      root = null
      rootMargin = "-34% 0px -46%"
      thresholds = [0, 0.05, 0.12, 0.2]
    }

    vi.stubGlobal("IntersectionObserver", ReadingLineObserver)
    const onActiveProductChange = vi.fn()

    render(
      <SaaSStoryStage
        labels={labels}
        motionMode="static"
        products={getLandingContent("pt").products.items}
        onActiveProductChange={onActiveProductChange}
      />,
    )

    const articles = screen.getAllByRole("article")
    const createEntry = (
      target: HTMLElement,
      intersectionRatio: number,
    ): IntersectionObserverEntry => {
      const targetRect = target.getBoundingClientRect()

      return {
        boundingClientRect: targetRect,
        intersectionRect: targetRect,
        rootBounds: null,
        target,
        time: 0,
        isIntersecting: intersectionRatio > 0,
        intersectionRatio,
      }
    }

    expect(observe).toHaveBeenCalledTimes(3)

    act(() => {
      notifyIntersection(
        [
          createEntry(articles[0], 0.18),
          createEntry(articles[1], 0),
          createEntry(articles[2], 0),
        ],
        {} as IntersectionObserver,
      )
    })

    expect(onActiveProductChange).toHaveBeenLastCalledWith("cryptovault")

    act(() => {
      notifyIntersection(
        [createEntry(articles[1], 0.05)],
        {} as IntersectionObserver,
      )
    })

    expect(onActiveProductChange).toHaveBeenCalledTimes(1)
    expect(
      within(screen.getByRole("list", { name: labels.progressLabel }))
        .getByText("CryptoVault")
        .closest("li"),
    ).toHaveAttribute("aria-current", "step")

    act(() => {
      notifyIntersection(
        [createEntry(articles[0], 0.04), createEntry(articles[1], 0.16)],
        {} as IntersectionObserver,
      )
    })

    expect(onActiveProductChange).toHaveBeenLastCalledWith("investfusion")

    act(() => {
      notifyIntersection(
        [createEntry(articles[0], 0.05)],
        {} as IntersectionObserver,
      )
    })

    expect(onActiveProductChange).toHaveBeenCalledTimes(2)

    act(() => {
      notifyIntersection(
        [createEntry(articles[0], 0.17), createEntry(articles[1], 0.04)],
        {} as IntersectionObserver,
      )
    })

    expect(onActiveProductChange).toHaveBeenLastCalledWith("cryptovault")
  })

  it("pins the desktop progress rail briefly without animating the pinned element", async () => {
    installMotionProfile("desktop")

    const { unmount } = render(
      <SaaSStoryStage
        labels={labels}
        motionMode="auto"
        products={getLandingContent("pt").products.items}
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
        "data-motion-profile",
        "desktop",
      )
      expect(ScrollTrigger.getById("products-progress-pin")).toBeDefined()
    })

    const pinTrigger = ScrollTrigger.getById("products-progress-pin")!
    const pinDistance = (pinTrigger.vars.end as () => string)()

    expect(pinTrigger.vars.pin).toBe(
      document.querySelector(".product-progress"),
    )
    expect(pinTrigger.vars.pinSpacing).toBe(false)
    expect(pinTrigger.animation).toBeUndefined()
    expect(pinDistance).toMatch(/^\+=\d+(?:\.\d+)?$/)
    expect(Number(pinDistance.slice(2))).toBeLessThanOrEqual(680)
    expect(
      ScrollTrigger.getById("product-motion-cryptovault")?.vars.scrub,
    ).toBe(0.35)
    expect(ScrollTrigger.getById("products-progress-orbit")).toBeDefined()
    expect(ScrollTrigger.getById("products-starfield-drift")).toBeDefined()
    expect(ScrollTrigger.getAll()).toHaveLength(6)

    unmount()
    expect(ScrollTrigger.getById("products-progress-pin")).toBeUndefined()
    expect(document.querySelector(".pin-spacer")).not.toBeInTheDocument()
  }, 10_000)

  it.each([
    ["tablet", 0.18],
    ["mobile", false],
  ] as const)(
    "keeps the %s product sequence local and unpinned",
    async (profile, scrub) => {
      installMotionProfile(profile)

      render(
        <SaaSStoryStage
          labels={labels}
          motionMode="auto"
          products={getLandingContent("pt").products.items}
        />,
      )

      await waitFor(() => {
        expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
          "data-motion-profile",
          profile,
        )
        expect(
          ScrollTrigger.getById("product-motion-cryptovault"),
        ).toBeDefined()
      })

      expect(ScrollTrigger.getById("products-progress-pin")).toBeUndefined()
      expect(
        ScrollTrigger.getById("product-motion-cryptovault")?.vars.scrub,
      ).toBe(scrub)
      expect(ScrollTrigger.getById("products-progress-orbit")).toBeUndefined()
      expect(ScrollTrigger.getById("products-starfield-drift")).toBeDefined()
      expect(ScrollTrigger.getAll()).toHaveLength(4)
    },
  )
})
