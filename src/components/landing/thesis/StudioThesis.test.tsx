// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { StudioThesis } from "@/components/landing/thesis/StudioThesis"
import { motionQueries } from "@/components/motion/motionQueries"
import { getLandingContent } from "@/content"
import { ScrollTrigger } from "@/lib/gsap"

function installMatchMedia({ reduced = false } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        query === motionQueries.isDesktop ||
        (query === motionQueries.reduceMotion && reduced),
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

it("keeps the complete studio thesis readable in the static document", () => {
  const content = getLandingContent("en").thesis

  render(<StudioThesis content={content} />)

  expect(screen.getByText(content.statement)).toBeVisible()
})

it("renders an illuminated orbital weave without floating nodes or lens rings", () => {
  const content = getLandingContent("en").thesis

  render(<StudioThesis content={content} />)

  const field = screen.getByTestId("orbital-field")
  expect(field.tagName).toBe("svg")
  expect(field).toHaveAttribute("aria-hidden", "true")
  expect(field.querySelectorAll("[data-orbital-thread]")).toHaveLength(7)
  expect(field.querySelectorAll("[data-orbital-halo]")).toHaveLength(7)
  expect(field.querySelectorAll("[data-orbital-core]")).toHaveLength(7)
  expect(field.querySelectorAll("[data-orbital-filament]")).toHaveLength(7)
  expect(field.querySelectorAll("[data-orbital-flow]")).toHaveLength(7)
  expect(field.querySelectorAll("[data-orbital-node]")).toHaveLength(0)
  expect(field.querySelectorAll("[data-orbital-lens]")).toHaveLength(0)
  expect(screen.queryByTestId("solar-corona")).not.toBeInTheDocument()
})

it("runs the orbital drift only while the thesis is in view", async () => {
  installMatchMedia()
  const content = getLandingContent("en").thesis

  const { unmount } = render(<StudioThesis content={content} />)

  await waitFor(() => {
    expect(ScrollTrigger.getById("thesis-orbital-drift")).toBeDefined()
  })

  const trigger = ScrollTrigger.getById("thesis-orbital-drift")!
  expect(trigger.vars.toggleActions).toBe("play pause resume pause")
  expect(trigger.animation).toBeDefined()

  unmount()
  expect(ScrollTrigger.getById("thesis-orbital-drift")).toBeUndefined()
})

it("renders a dense radiant field and pauses its drift outside the thesis", async () => {
  installMatchMedia()
  const content = getLandingContent("en").thesis

  const { unmount } = render(<StudioThesis content={content} />)

  const starfield = screen.getByTestId("pearlescent-starfield")
  expect(starfield).toHaveAttribute("aria-hidden", "true")
  expect(starfield.querySelectorAll("[data-star]").length).toBeGreaterThan(16)

  const pearlStars = starfield.querySelectorAll('[data-tone="pearl"]').length
  const copperStars = starfield.querySelectorAll('[data-tone="copper"]').length
  expect(Math.abs(pearlStars - copperStars)).toBeLessThanOrEqual(2)

  await waitFor(() => {
    expect(ScrollTrigger.getById("thesis-starfield-drift")).toBeDefined()
  })

  const trigger = ScrollTrigger.getById("thesis-starfield-drift")!
  expect(trigger.vars.toggleActions).toBe("play pause resume pause")
  expect(trigger.animation).toBeDefined()

  unmount()
  expect(ScrollTrigger.getById("thesis-starfield-drift")).toBeUndefined()
}, 10_000)

it("keeps every star visible without drift when reduced motion is requested", async () => {
  installMatchMedia({ reduced: true })
  const content = getLandingContent("en").thesis

  render(<StudioThesis content={content} />)

  const starfield = screen.getByTestId("pearlescent-starfield")

  await waitFor(() => {
    expect(starfield).toHaveAttribute("data-motion-profile", "reduced")
  })

  expect(starfield.querySelectorAll("[data-star]").length).toBeGreaterThan(16)
  expect(ScrollTrigger.getById("thesis-starfield-drift")).toBeUndefined()
})
