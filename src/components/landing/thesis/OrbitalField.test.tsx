// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { OrbitalField } from "@/components/landing/thesis/OrbitalField"
import { motionQueries } from "@/components/motion/motionQueries"
import { gsap, ScrollTrigger } from "@/lib/gsap"

function installMatchMedia(active: keyof typeof motionQueries = "isDesktop") {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === motionQueries[active],
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

function readFlows() {
  return [
    ...screen
      .getByTestId("orbital-field")
      .querySelectorAll<SVGPathElement>("[data-orbital-flow]"),
  ]
}

function transformOf(element: Element) {
  return (
    (element as SVGGraphicsElement).style.transform ||
    element.getAttribute("transform") ||
    ""
  )
}

function dashPeriodOf(flow: SVGPathElement) {
  return (flow.getAttribute("stroke-dasharray") ?? "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .reduce((total, segment) => total + Number.parseFloat(segment), 0)
}

// GSAP animations are thenable, so an async helper must never return one
// directly: awaiting it would wait for a loop that never completes.
async function waitForDrift() {
  await waitFor(() => {
    expect(ScrollTrigger.getById("thesis-orbital-drift")).toBeDefined()
  })
}

function driftAnimation() {
  const animation = ScrollTrigger.getById("thesis-orbital-drift")?.animation
  expect(animation).toBeDefined()
  return animation!
}

afterEach(() => {
  cleanup()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  // The breath is an unnamed repeat: -1 timeline, so killing the triggers does
  // not reach it. Left alive it keeps ticking for the rest of the process and
  // starves the slower suites of CPU.
  gsap.globalTimeline.getChildren().forEach((child) => child.kill())
  vi.unstubAllGlobals()
})

it("keeps the authored weave proportions instead of stretching it into the viewport", () => {
  render(<OrbitalField />)

  const field = screen.getByTestId("orbital-field")
  expect(field).toHaveAttribute("viewBox", "0 0 1440 252")
  expect(field).toHaveAttribute("preserveAspectRatio", "xMidYMax slice")
})

it("gives every flow its own dash pattern so the travelling light stays legible", () => {
  render(<OrbitalField />)

  const flows = readFlows()
  expect(flows).toHaveLength(7)

  for (const flow of flows) {
    expect(flow).toHaveAttribute("pathLength", "1000")
    expect(dashPeriodOf(flow)).toBeGreaterThan(0)
  }
})

it.each(["isDesktop", "isTablet", "isMobile"] as const)(
  "advances every flow at one steady pace for a whole loop on %s",
  async (viewport) => {
    installMatchMedia(viewport)
    render(<OrbitalField />)

    await waitForDrift()
    const drift = driftAnimation()
    const cycle = drift.duration()
    expect(cycle).toBeGreaterThan(0)

    const flows = readFlows()
    const steps = 24
    const readings = flows.map<number[]>(() => [])

    for (let step = 0; step < steps; step += 1) {
      drift.totalTime((cycle * step) / steps)
      flows.forEach((flow, index) => {
        readings[index].push(Number.parseFloat(flow.style.strokeDashoffset))
      })
    }

    readings.forEach((values) => {
      const deltas = values
        .slice(1)
        .map((value, index) => value - values[index])
        .map((delta) => Number(delta.toFixed(4)))

      // A stall shows up as a zero delta, a yoyo reversal as a positive one.
      expect(Math.max(...deltas)).toBeLessThan(0)
      expect(Math.min(...deltas) / Math.max(...deltas)).toBeCloseTo(1, 2)
    })
  },
)

it("returns each flow to the same dash phase at the end of a loop so the repeat is invisible", async () => {
  installMatchMedia()
  render(<OrbitalField />)

  await waitForDrift()
  const drift = driftAnimation()
  const cycle = drift.duration()
  const flows = readFlows()

  drift.totalTime(0)
  const start = flows.map((flow) =>
    Number.parseFloat(flow.style.strokeDashoffset),
  )

  drift.totalTime(cycle * 0.999999)
  const end = flows.map((flow) =>
    Number.parseFloat(flow.style.strokeDashoffset),
  )

  flows.forEach((flow, index) => {
    const period = dashPeriodOf(flow)
    const travel = start[index] - end[index]

    expect(travel).toBeGreaterThan(0)
    expect(travel / period).toBeCloseTo(Math.round(travel / period), 3)
  })
})

it("holds the drift still until the thesis scrolls into view and drops it on unmount", async () => {
  installMatchMedia()
  const { unmount } = render(<OrbitalField />)

  await waitForDrift()

  expect(
    ScrollTrigger.getById("thesis-orbital-drift")?.vars.toggleActions,
  ).toBe("play pause resume pause")

  unmount()
  expect(ScrollTrigger.getById("thesis-orbital-drift")).toBeUndefined()
})

// The weave is authored in the markup, so this contract needs no motion
// profile and no running timeline to verify.
it("draws the halo glow without a per-frame SVG filter", () => {
  render(<OrbitalField />)

  const field = screen.getByTestId("orbital-field")

  // WebKit rasterises SVG filter regions on the CPU and redoes it on every
  // animated frame, which collapsed this weave to single-digit frame rates.
  // The glow is a blurred, offset copy of the halo instead.
  expect(field.querySelector("feGaussianBlur")).toBeNull()
  expect(
    [...field.querySelectorAll("[filter]")].map((node) =>
      node.getAttribute("filter"),
    ),
  ).toEqual([])

  const glows = [...field.querySelectorAll("[data-orbital-glow]")]
  expect(glows).toHaveLength(7)

  glows.forEach((glow, index) => {
    const halo = field.querySelector(`[data-orbital-halo="${index}"]`)
    expect(glow.getAttribute("d")).toBe(halo?.getAttribute("d"))
    // The offset the merged filter used to apply.
    expect(glow.getAttribute("transform")).toBe("translate(5 2)")
    // The blurred copy sits behind the sharp halo, as the filter merge did.
    expect(
      glow.compareDocumentPosition(halo!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})

it("moves every glow layer with the thread it lights", async () => {
  installMatchMedia()
  render(<OrbitalField />)

  await waitForDrift()

  const field = screen.getByTestId("orbital-field")
  const threads = [
    ...field.querySelectorAll<SVGGElement>("[data-orbital-thread]"),
  ]
  expect(threads).toHaveLength(7)

  const breath = gsap.getTweensOf(threads[0])[0]?.parent
  expect(breath).toBeTruthy()
  breath?.totalTime(3.2)

  threads.forEach((thread, index) => {
    // The breath is what displaces the thread, so its glow has to ride with it.
    expect(transformOf(thread)).not.toBe("")
    expect(
      thread.querySelector(`[data-orbital-halo="${index}"]`),
    ).not.toBeNull()
  })
})
