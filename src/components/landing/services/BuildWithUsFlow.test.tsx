// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { BuildWithUsFlow } from "@/components/landing/services/BuildWithUsFlow"
import { motionQueries } from "@/components/motion/motionQueries"
import { getLandingContent } from "@/content"
import { gsap, ScrollTrigger } from "@/lib/gsap"

const labels = {
  sectionLabel: "Services",
  destinationPending: "Contact destination arrives in the next phase",
} as const

type MotionProfile = "desktop" | "mobile" | "reduced"

function installMotionProfile(profile: MotionProfile) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        (profile === "desktop" && query === motionQueries.isDesktop) ||
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

function readScale(element: Element, axis: "scaleX" | "scaleY") {
  return Number(gsap.getProperty(element, axis))
}

function installIntersectionObserver() {
  let callback: IntersectionObserverCallback | undefined
  const disconnect = vi.fn()

  class IntersectionObserverStub {
    constructor(nextCallback: IntersectionObserverCallback) {
      callback = nextCallback
    }

    disconnect = disconnect
    observe = vi.fn()
    takeRecords = vi.fn(() => [])
    unobserve = vi.fn()
    root = null
    rootMargin = "0px"
    thresholds = [0]
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub)

  return {
    disconnect,
    setVisible(isIntersecting: boolean) {
      callback?.(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    },
  }
}

afterEach(() => {
  cleanup()
  gsap.getById("services-flow-loop")?.kill()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
})

it("renders the four service stages as one ordered journey", () => {
  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  const journey = screen.getByRole("list", { name: labels.sectionLabel })
  const layers = within(journey)
    .getAllByRole("listitem")
    .filter((layer) => layer.parentElement === journey)

  expect(layers).toHaveLength(4)
  expect(
    layers.map((layer) => within(layer).getByRole("heading").textContent),
  ).toEqual([
    "Build",
    "Connect and automate",
    "Operate with confidence",
    "Expand frontiers",
  ])
  expect(document.querySelectorAll(".capability-layer__node")).toHaveLength(4)
  expect(
    document.querySelectorAll(".capability-layer__connector"),
  ).toHaveLength(5)
  expect(
    document.querySelectorAll(".capability-layer__connector--leading"),
  ).toHaveLength(1)
  expect(
    document.querySelectorAll(".capability-layer__connector--trailing"),
  ).toHaveLength(1)
})

it("links the approved CTA to the existing contact section", () => {
  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  const cta = screen.getByRole("link", { name: "Start a conversation" })

  expect(cta).toHaveAttribute("href", "#contact")
  expect(cta).not.toHaveAttribute("aria-disabled")
  expect(screen.queryByText(labels.destinationPending)).not.toBeInTheDocument()
})

it.each(["desktop", "mobile"] as const)(
  "runs the %s journey as a continuous sequence independent from scroll",
  async (profile) => {
    installMotionProfile(profile)

    const { unmount } = render(
      <BuildWithUsFlow
        content={getLandingContent("en").services}
        labels={labels}
      />,
    )

    await waitFor(() => {
      expect(document.getElementById("services")).toHaveAttribute(
        "data-motion-profile",
        profile,
      )
    })

    expect(ScrollTrigger.getById("services-flow-progress")).toBeUndefined()

    const loop = gsap.getById("services-flow-loop")
    expect(loop).toBeDefined()
    expect(loop?.repeat()).toBe(-1)

    const journey = screen.getByRole("list", { name: labels.sectionLabel })
    const layers = within(journey)
      .getAllByRole("listitem")
      .filter((layer) => layer.parentElement === journey)
    const signals = Array.from(
      journey.querySelectorAll(".capability-layer__signal"),
    )
    const fills = Array.from(
      journey.querySelectorAll(".capability-layer__connector-fill"),
    )

    expect(layers.map((layer) => layer.dataset.active)).toEqual([
      "false",
      "false",
      "false",
      "false",
    ])
    expect(signals.map((signal) => readScale(signal, "scaleX"))).toEqual([
      0, 0, 0, 0,
    ])
    expect(fills).toHaveLength(5)

    expect(
      within(journey)
        .getAllByRole("listitem")
        .filter((layer) => layer.parentElement === journey)
        .every((layer) => layer.style.opacity !== "0"),
    ).toBe(true)

    act(() => {
      loop?.pause().seek("stage-0+=0.01")
    })

    expect(layers.map((layer) => layer.dataset.active)).toEqual([
      "true",
      "false",
      "false",
      "false",
    ])
    const primaryAxisProgress = fills.map((fill) =>
      readScale(fill, profile === "desktop" ? "scaleX" : "scaleY"),
    )
    expect(primaryAxisProgress[0]).toBeGreaterThan(0)
    expect(primaryAxisProgress.slice(1)).toEqual([0, 0, 0, 0])
    expect(
      fills.map((fill) =>
        readScale(fill, profile === "desktop" ? "scaleY" : "scaleX"),
      ),
    ).toEqual([1, 1, 1, 1, 1])

    const expectedProgress = [
      {
        label: "stage-1",
        states: ["true", "true", "false", "false"],
        filledSegments: 2,
      },
      {
        label: "stage-2",
        states: ["true", "true", "true", "false"],
        filledSegments: 3,
      },
      {
        label: "stage-3",
        states: ["true", "true", "true", "true"],
        filledSegments: 4,
      },
    ]

    expectedProgress.forEach(({ label, states, filledSegments }) => {
      act(() => {
        loop?.seek(`${label}+=0.01`)
      })

      expect(layers.map((layer) => layer.dataset.active)).toEqual(states)
      expect(
        fills
          .slice(0, filledSegments)
          .every(
            (fill) =>
              readScale(fill, profile === "desktop" ? "scaleX" : "scaleY") >
              0.99,
          ),
      ).toBe(true)
    })

    act(() => {
      loop?.seek("journey-complete")
    })
    expect(signals.every((signal) => readScale(signal, "scaleX") > 0.99)).toBe(
      true,
    )
    expect(
      fills.every(
        (fill) =>
          readScale(fill, profile === "desktop" ? "scaleX" : "scaleY") > 0.99,
      ),
    ).toBe(true)

    unmount()
    expect(gsap.getById("services-flow-loop")).toBeUndefined()
  },
)

it("pauses the services loop while the section is outside the viewport", async () => {
  installMotionProfile("desktop")
  const observer = installIntersectionObserver()

  const { unmount } = render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  await waitFor(() => {
    expect(gsap.getById("services-flow-loop")).toBeDefined()
  })

  const loop = gsap.getById("services-flow-loop")
  expect(loop?.paused()).toBe(true)

  act(() => observer.setVisible(true))
  expect(loop?.paused()).toBe(false)

  act(() => observer.setVisible(false))
  expect(loop?.paused()).toBe(true)

  unmount()
  expect(observer.disconnect).toHaveBeenCalledOnce()
})

it("keeps the motion enhancement paused when viewport observation is unavailable", async () => {
  installMotionProfile("desktop")

  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  await waitFor(() => {
    expect(gsap.getById("services-flow-loop")).toBeDefined()
  })

  expect(gsap.getById("services-flow-loop")?.paused()).toBe(true)
})

it("keeps the complete journey visible without a trigger in reduced motion", async () => {
  installMotionProfile("reduced")

  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  await waitFor(() => {
    expect(document.getElementById("services")).toHaveAttribute(
      "data-motion-profile",
      "reduced",
    )
  })

  expect(ScrollTrigger.getById("services-flow-progress")).toBeUndefined()
  expect(gsap.getById("services-flow-loop")).toBeUndefined()
  const journey = screen.getByRole("list", { name: labels.sectionLabel })
  expect(
    within(journey)
      .getAllByRole("listitem")
      .filter((layer) => layer.parentElement === journey),
  ).toHaveLength(4)
  expect(
    Array.from(
      journey.querySelectorAll(
        ".capability-layer__signal, .capability-layer__connector-fill",
      ),
    ).every(
      (element) =>
        readScale(element, "scaleX") === 1 &&
        readScale(element, "scaleY") === 1,
    ),
  ).toBe(true)
})
