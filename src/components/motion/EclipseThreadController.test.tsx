// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { EclipseThreadController } from "@/components/motion/EclipseThreadController"
import { motionQueries } from "@/components/motion/motionQueries"
import { ScrollTrigger } from "@/lib/gsap"

function installMatchMedia({
  desktop = false,
  reduced = false,
}: {
  desktop?: boolean
  reduced?: boolean
}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        (query === motionQueries.isDesktop && desktop) ||
        (query === motionQueries.reduceMotion && reduced) ||
        (!desktop && !reduced && query === motionQueries.isMobile),
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

function ControllerHarness() {
  return (
    <div>
      <EclipseThreadController />
      {[
        "hero",
        "thesis",
        "products",
        "credibility",
        "services",
        "aegis",
        "founder",
        "contact",
      ].map((id) => (
        <section id={id} key={id}>
          {id}
        </section>
      ))}
    </div>
  )
}

afterEach(() => {
  cleanup()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
})

it("creates document-order desktop triggers and removes them on unmount", async () => {
  installMatchMedia({ desktop: true })
  expect(window.matchMedia(motionQueries.isDesktop).matches).toBe(true)
  const baseline = ScrollTrigger.getAll().length

  const { unmount } = render(<ControllerHarness />)

  await waitFor(() => {
    expect(screen.getByTestId("eclipse-thread-controller")).toHaveAttribute(
      "data-motion-profile",
      "desktop",
    )
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(baseline)
  })

  expect(ScrollTrigger.getAll().map((trigger) => trigger.vars.id)).toEqual([
    "eclipse-hero",
    "eclipse-thesis",
    "eclipse-products",
    "eclipse-credibility",
    "eclipse-services",
    "eclipse-aegis",
    "eclipse-founder",
    "eclipse-contact",
  ])
  expect(
    ScrollTrigger.getAll().every((trigger) => trigger.animation == null),
  ).toBe(true)

  act(() => {
    const contactTrigger = ScrollTrigger.getById("eclipse-contact")
    contactTrigger?.vars.onEnter?.(contactTrigger)
  })

  expect(screen.getByTestId("eclipse-thread-controller")).toHaveAttribute(
    "data-state",
    "closing-ring",
  )

  act(() => {
    const thesisTrigger = ScrollTrigger.getById("eclipse-thesis")
    thesisTrigger?.vars.onEnterBack?.(thesisTrigger)
  })

  expect(screen.getByTestId("eclipse-thread-controller")).toHaveAttribute(
    "data-state",
    "line",
  )

  unmount()
  expect(ScrollTrigger.getAll()).toHaveLength(baseline)
})

it("tracks reduced-motion chapters discretely without scroll triggers", async () => {
  let notifyIntersection: IntersectionObserverCallback = () => undefined
  const observe = vi.fn()
  const disconnect = vi.fn()

  class StaticChapterObserver {
    constructor(callback: IntersectionObserverCallback) {
      notifyIntersection = callback
    }

    observe = observe
    disconnect = disconnect
    unobserve = vi.fn()
    takeRecords = vi.fn(() => [])
    root = null
    rootMargin = "-42% 0px -42%"
    thresholds = [0, 0.05, 0.2, 0.5, 0.8]
  }

  vi.stubGlobal("IntersectionObserver", StaticChapterObserver)
  installMatchMedia({ desktop: true, reduced: true })
  expect(window.matchMedia(motionQueries.reduceMotion).matches).toBe(true)

  const { unmount } = render(<ControllerHarness />)

  await waitFor(() => {
    expect(screen.getByTestId("eclipse-thread-controller")).toHaveAttribute(
      "data-motion-profile",
      "reduced",
    )
  })

  expect(screen.getByTestId("eclipse-thread")).toHaveAttribute(
    "data-motion",
    "static",
  )
  expect(observe).toHaveBeenCalledTimes(8)
  expect(ScrollTrigger.getAll()).toHaveLength(0)

  const contact = document.querySelector<HTMLElement>("#contact")
  expect(contact).not.toBeNull()

  act(() => {
    const rect = contact!.getBoundingClientRect()
    notifyIntersection(
      [
        {
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: null,
          target: contact!,
          time: 0,
          isIntersecting: true,
          intersectionRatio: 0.8,
        },
      ],
      {} as IntersectionObserver,
    )
  })

  expect(screen.getByTestId("eclipse-thread-controller")).toHaveAttribute(
    "data-state",
    "closing-ring",
  )

  unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
