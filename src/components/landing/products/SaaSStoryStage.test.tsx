// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
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
  progressLabel: "Navegação dos produtos",
  conceptualEvidence: "Representação conceitual",
  destinationPending: "Destino aguardando aprovação",
  productionStatus: "Em produção",
  developmentStatus: "Em desenvolvimento",
  productionShortStatus: "Prod.",
  developmentShortStatus: "Desenv.",
  mobileGridLabel: "Escolha um produto",
  mobileInteractionHint: "Toque em um produto para ver detalhes",
  collapseProduct: "Fechar detalhes",
  previousProduct: "Produto anterior",
  nextProduct: "Próximo produto",
} as const

const baseContent = getLandingContent("pt").products
const approvedItems = baseContent.items.map((product, index) => ({
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
})) as LandingContentDraft["products"]["items"]
const approvedContent = { ...baseContent, items: approvedItems }

type MotionProfile = "desktop" | "tablet" | "mobile" | "reduced"

function installMotionProfile(profile: MotionProfile) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        (profile === "desktop" && query === motionQueries.isDesktop) ||
        (profile === "tablet" && query === motionQueries.isTablet) ||
        (profile === "mobile" && query === motionQueries.isMobile) ||
        (profile === "reduced" && query === motionQueries.reduceMotion),
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
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView")
  window.history.replaceState(null, "", "/")
  vi.unstubAllGlobals()
})

describe("SaaSStoryStage", () => {
  it("renders the complete observatory in linear mode", () => {
    render(
      <SaaSStoryStage
        content={baseContent}
        labels={labels}
        motionMode="static"
      />,
    )

    expect(
      screen.getByRole("heading", { level: 2, name: baseContent.title }),
    ).toBeVisible()
    expect(screen.getByText(baseContent.summary)).toBeVisible()
    const closing = screen.getByText(baseContent.closing)
    expect(closing).toBeVisible()
    expect(
      closing.parentElement?.querySelector(
        ".product-observatory__release-rule",
      ),
    ).toHaveAttribute("aria-hidden", "true")
    expect(
      screen.getByRole("navigation", { name: labels.progressLabel }),
    ).toBeVisible()

    const articles = screen.getAllByRole("article")
    expect(articles).toHaveLength(4)
    expect(
      articles.map(
        (article) =>
          within(article).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual(baseContent.items.map((product) => product.title))
    expect(articles.map((article) => article.dataset.productStage)).toEqual([
      "production",
      "production",
      "production",
      "development",
    ])
    for (const article of articles) {
      expect(article).not.toHaveAttribute("aria-hidden")
      expect(article).not.toHaveAttribute("inert")
      expect(within(article).getByText(labels.conceptualEvidence)).toBeVisible()
    }
    expect(
      document.querySelectorAll(".product-observatory__segment"),
    ).toHaveLength(4)
    expect(document.querySelector(".product-progress__orbit")).toBeNull()
  })

  it("preserves approved evidence, destinations, and analytics", async () => {
    const user = userEvent.setup()
    const events: AllowedEvent[] = []

    render(
      <SaaSStoryStage
        content={approvedContent}
        labels={labels}
        motionMode="static"
        trackEvent={(event) => events.push(event)}
      />,
    )

    expect(screen.getAllByTestId("product-media")).toHaveLength(4)
    await user.click(
      screen.getByRole("link", { name: /Conhecer o BullLedger/ }),
    )
    expect(events).toEqual([
      { name: "product_view", productId: "cryptovault" },
      { name: "product_click", productId: "bullledger" },
    ])
  })

  it("uses only the active index state on desktop, without a progress track", async () => {
    installMotionProfile("desktop")

    const { unmount } = render(
      <SaaSStoryStage
        content={baseContent}
        labels={labels}
        motionMode="auto"
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
        "data-motion-profile",
        "desktop",
      )
    })

    expect(
      document.querySelector(".product-observatory__progress-track"),
    ).toBeNull()
    expect(
      ScrollTrigger.getById("products-observatory-progress"),
    ).toBeUndefined()
    expect(ScrollTrigger.getAll().every((trigger) => !trigger.vars.pin)).toBe(
      true,
    )
    expect(ScrollTrigger.getById("products-progress-pin")).toBeUndefined()
    expect(ScrollTrigger.getById("products-progress-orbit")).toBeUndefined()
    expect(ScrollTrigger.getById("product-motion-cryptovault")).toBeUndefined()
    expect(
      document.querySelectorAll('.product-panel[aria-hidden="true"]'),
    ).toHaveLength(3)

    unmount()
  })

  it("moves a desktop index selection to the matching scroll segment", async () => {
    installMotionProfile("desktop")
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    })
    const user = userEvent.setup()

    render(
      <SaaSStoryStage
        content={baseContent}
        labels={labels}
        motionMode="auto"
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
        "data-motion-profile",
        "desktop",
      )
    })
    await user.click(
      screen.getByRole("link", { name: /SafeNumberEm produção/ }),
    )

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" })
    expect(scrollIntoView.mock.instances[0]).toHaveAttribute(
      "id",
      "product-safenumber-segment",
    )
  })

  it("synchronizes footer product fragments with the desktop observatory", async () => {
    installMotionProfile("desktop")
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    })

    render(
      <SaaSStoryStage
        content={baseContent}
        labels={labels}
        motionMode="auto"
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
        "data-motion-profile",
        "desktop",
      )
    })
    window.location.hash = "#product-safenumber"
    window.dispatchEvent(new HashChangeEvent("hashchange"))

    await waitFor(() => {
      expect(
        document.querySelector('.product-panel[data-product="safenumber"]'),
      ).toHaveAttribute("data-active", "true")
    })
    expect(scrollIntoView.mock.instances.at(-1)).toHaveAttribute(
      "id",
      "product-safenumber-segment",
    )
  })

  it.each(["tablet", "reduced"] as const)(
    "keeps the %s sequence linear and unanimated",
    async (profile) => {
      installMotionProfile(profile)

      render(
        <SaaSStoryStage
          content={baseContent}
          labels={labels}
          motionMode="auto"
        />,
      )

      await waitFor(() => {
        expect(screen.getByLabelText(labels.sectionLabel)).toHaveAttribute(
          "data-motion-profile",
          profile,
        )
      })

      expect(
        ScrollTrigger.getById("products-observatory-progress"),
      ).toBeUndefined()
      for (const article of screen.getAllByRole("article")) {
        expect(article).not.toHaveAttribute("aria-hidden")
        expect(article).not.toHaveAttribute("inert")
      }
    },
  )

  it("uses the compact explorer on mobile and records only an opened product", async () => {
    installMotionProfile("mobile")
    const user = userEvent.setup()
    const events: AllowedEvent[] = []

    render(
      <SaaSStoryStage
        content={baseContent}
        labels={labels}
        motionMode="auto"
        trackEvent={(event) => events.push(event)}
      />,
    )

    await waitFor(() => {
      expect(screen.getByTestId("mobile-product-explorer")).toBeVisible()
    })
    expect(events).toEqual([])
    expect(screen.getByTestId("mobile-product-explorer")).toHaveAttribute(
      "data-expanded",
      "false",
    )

    await user.click(
      screen.getByRole("button", { name: /SafeNumber, Em produção/ }),
    )

    await waitFor(() => {
      expect(events).toEqual([
        { name: "product_view", productId: "safenumber" },
      ])
    })
    expect(screen.getByTestId("mobile-product-explorer")).toHaveAttribute(
      "data-expanded",
      "true",
    )
    expect(screen.getAllByRole("article")).toHaveLength(1)
  })
})
