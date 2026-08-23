// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { ProgressiveNav } from "@/components/landing/navigation/ProgressiveNav"
import { ScrollTrigger } from "@/lib/gsap"

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
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
  window.location.hash = ""
})

it("fills the navigation progress line as the document approaches its end", async () => {
  const { unmount } = render(
    <ProgressiveNav content={navigationContent} currentLocale="en" />,
  )

  const track = document.querySelector<HTMLElement>(
    ".landing-nav__scroll-track",
  )
  const indicator = track?.querySelector<HTMLElement>(
    ".landing-nav__scroll-progress",
  )

  expect(track).toHaveAttribute("aria-hidden", "true")
  expect(indicator).not.toBeNull()

  await waitFor(() => {
    expect(ScrollTrigger.getById("navigation-scroll-progress")).toBeDefined()
  })

  const trigger = ScrollTrigger.getById("navigation-scroll-progress")!

  act(() => {
    trigger.vars.onUpdate?.({
      progress: 0.5,
      scroll: () => 500,
    } as unknown as ScrollTrigger)
  })

  expect(indicator).toHaveStyle({ transform: "scale(0.5, 1)" })

  unmount()
  expect(ScrollTrigger.getById("navigation-scroll-progress")).toBeUndefined()
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

it("keeps the wordmark at the top and through content, then retracts at the footer", async () => {
  const { unmount } = render(
    <>
      <ProgressiveNav content={navigationContent} currentLocale="en" />
      <main />
      <footer className="atmospheric-footer" />
    </>,
  )

  const navigation = document.querySelector("header.landing-nav")
  const mark = screen.getByRole("link", { name: "Voynan — back to start" })

  await waitFor(() => {
    expect(ScrollTrigger.getById("navigation-scroll-progress")).toBeDefined()
    expect(ScrollTrigger.getById("navigation-footer-brand")).toBeDefined()
  })

  const progressTrigger = ScrollTrigger.getById("navigation-scroll-progress")!
  const footerTrigger = ScrollTrigger.getById("navigation-footer-brand")!

  expect(navigation).toHaveAttribute("data-scrolled", "false")
  expect(mark).toHaveAttribute("data-collapsed", "false")

  act(() => {
    progressTrigger.vars.onUpdate?.({
      progress: 0.2,
      scroll: () => 24,
    } as unknown as ScrollTrigger)
  })

  expect(navigation).toHaveAttribute("data-scrolled", "true")
  expect(mark).toHaveAttribute("data-collapsed", "false")

  act(() => {
    footerTrigger.vars.onToggle?.({
      isActive: true,
    } as unknown as ScrollTrigger)
  })

  expect(mark).toHaveAttribute("data-collapsed", "true")

  act(() => {
    progressTrigger.vars.onUpdate?.({
      progress: 0,
      scroll: () => 0,
    } as unknown as ScrollTrigger)
  })

  expect(navigation).toHaveAttribute("data-scrolled", "false")
  expect(mark).toHaveAttribute("data-collapsed", "false")

  unmount()
  expect(ScrollTrigger.getById("navigation-footer-brand")).toBeUndefined()
})
