// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { SolarCorona } from "@/components/landing/thesis/SolarCorona"
import { motionQueries } from "@/components/motion/motionQueries"
import { ScrollTrigger } from "@/lib/gsap"

function installMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === motionQueries.isDesktop,
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

it("preserves the solar limb and its seven magnetic filaments", () => {
  render(<SolarCorona />)

  const corona = screen.getByTestId("solar-corona")
  expect(corona.tagName).toBe("svg")
  expect(corona).toHaveAttribute("aria-hidden", "true")
  expect(corona.querySelectorAll("[data-corona-filament]")).toHaveLength(7)
  expect(corona.querySelector("[data-corona-limb]")).toBeInTheDocument()
})

it("keeps the preserved coronal cycle pausable when rendered elsewhere", async () => {
  installMatchMedia()

  const { unmount } = render(<SolarCorona />)

  await waitFor(() => {
    expect(ScrollTrigger.getById("thesis-corona-cycle")).toBeDefined()
  })

  const trigger = ScrollTrigger.getById("thesis-corona-cycle")!
  expect(trigger.vars.toggleActions).toBe("play pause resume pause")
  expect(trigger.animation).toBeDefined()

  unmount()
  expect(ScrollTrigger.getById("thesis-corona-cycle")).toBeUndefined()
})
