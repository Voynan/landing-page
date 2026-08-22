// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { act, cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { ProgressiveNav } from "@/components/landing/navigation/ProgressiveNav"

const navigationContent = {
  ariaLabel: "Primary navigation",
  openMenuLabel: "Open navigation",
  closeMenuLabel: "Close navigation",
  homeLabel: "Voynan — back to start",
  languageLabel: "Language",
  localeLabels: { en: "English", pt: "Portuguese" },
  links: [
    { label: "Products", sectionId: "products" },
    { label: "Open source", sectionId: "aegis" },
    { label: "Build with us", sectionId: "contact" },
  ],
} as const

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  window.location.hash = ""
})

it("opens the compact navigation with an exposed expanded state and focus", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  const trigger = screen.getByRole("button", { name: "Open navigation" })
  expect(trigger).toHaveAttribute("aria-expanded", "false")

  await user.click(trigger)

  expect(
    screen.getByRole("button", { name: "Close navigation" }),
  ).toHaveAttribute("aria-expanded", "true")
  expect(screen.getAllByRole("link", { name: "Products" })[1]).toHaveFocus()

  await user.keyboard("{Escape}")

  expect(screen.getByRole("button", { name: "Open navigation" })).toHaveFocus()
  expect(
    screen.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false")
})

it("exposes navigation as ordinary chapter links without JavaScript routing", () => {
  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
    "href",
    "#products",
  )
  expect(screen.getByRole("link", { name: "Build with us" })).toHaveAttribute(
    "href",
    "#contact",
  )
})

it("keeps one persistent language control when the compact menu opens", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Open navigation" }))

  expect(screen.getAllByRole("group", { name: "Language" })).toHaveLength(1)
})

it("preserves the current hash when section observation is unavailable", () => {
  window.location.hash = "#thesis"

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "href",
    "/pt#thesis",
  )

  act(() => {
    window.location.hash = "#contact"
    window.dispatchEvent(new HashChangeEvent("hashchange"))
  })

  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "href",
    "/pt#contact",
  )
})

it("keeps the full mark until the hero leaves the observer reading area", () => {
  let observerCallback: IntersectionObserverCallback | undefined
  const observedElements: Element[] = []
  const disconnectObserver = vi.fn()

  class IntersectionObserverStub implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ""
    readonly thresholds = [0, 0.45, 1]

    constructor(callback: IntersectionObserverCallback) {
      observerCallback = callback
    }

    disconnect() {
      disconnectObserver()
    }
    observe(element: Element) {
      observedElements.push(element)
    }
    takeRecords() {
      return []
    }
    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub)
  const { unmount } = render(
    <>
      <ProgressiveNav content={navigationContent} currentLocale="en" />
      <main>
        <section id="hero" />
      </main>
    </>,
  )

  const hero = document.querySelector("section#hero")
  const mark = screen.getByRole("link", { name: "Voynan — back to start" })

  expect(hero).not.toBeNull()
  expect(observedElements).toContain(hero)

  act(() => {
    observerCallback?.(
      [
        {
          target: hero,
          isIntersecting: true,
          intersectionRatio: 0.2,
          boundingClientRect: { bottom: 1_000, height: 1_000, top: 0 },
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  })

  expect(mark).toHaveAttribute("data-collapsed", "false")

  act(() => {
    observerCallback?.(
      [
        {
          target: hero,
          isIntersecting: false,
          intersectionRatio: 0,
          boundingClientRect: { bottom: 160, height: 1_000, top: -840 },
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  })

  expect(mark).toHaveAttribute("data-collapsed", "true")

  unmount()
  expect(disconnectObserver).toHaveBeenCalledOnce()
})
