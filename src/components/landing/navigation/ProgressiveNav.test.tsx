// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { ProgressiveNav } from "@/components/landing/navigation/ProgressiveNav"
import { ScrollTrigger } from "@/lib/gsap"

const navigationContent = {
  ariaLabel: "Primary navigation",
  homeLabel: "Voynan — back to start",
  languageLabel: "Language",
  localeLabels: { en: "English", pt: "Portuguese" },
  menuLabel: "Sections",
  links: [
    { label: "Start", sectionId: "hero" },
    { label: "Thesis", sectionId: "thesis" },
    { label: "Products", sectionId: "products" },
    { label: "Build with us", sectionId: "services" },
    { label: "Open source", sectionId: "aegis" },
    { label: "Founder", sectionId: "founder" },
    { label: "Contact", sectionId: "contact" },
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

it("keeps the chapter index behind a single trigger instead of standing links", () => {
  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  const trigger = screen.getByRole("button", { name: "Sections" })
  expect(trigger).toHaveAttribute("aria-expanded", "false")
  expect(trigger).toHaveAttribute("aria-controls", "section-index-menu")
  expect(
    screen.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible()

  for (const link of navigationContent.links) {
    expect(screen.queryByRole("link", { name: link.label })).toBeNull()
  }
})

it("opens every chapter destination from the single quick menu", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Sections" }))

  expect(screen.getByRole("button", { name: "Sections" })).toHaveAttribute(
    "aria-expanded",
    "true",
  )

  for (const link of navigationContent.links) {
    expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
      "href",
      `#${link.sectionId}`,
    )
  }

  expect(screen.getByRole("link", { name: "Start" })).toHaveFocus()

  await user.keyboard("{Escape}")

  expect(screen.getByRole("button", { name: "Sections" })).toHaveFocus()
  expect(screen.getByRole("button", { name: "Sections" })).toHaveAttribute(
    "aria-expanded",
    "false",
  )
  expect(screen.queryByRole("link", { name: "Contact" })).toBeNull()
})

it("marks the observed chapter inside the quick menu", async () => {
  const user = userEvent.setup()
  window.location.hash = "#aegis"

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Sections" }))

  expect(screen.getByRole("link", { name: "Open source" })).toHaveAttribute(
    "aria-current",
    "location",
  )
  expect(screen.getByRole("link", { name: "Products" })).not.toHaveAttribute(
    "aria-current",
  )
})

it("closes the quick menu when a pointer lands outside the navigation", async () => {
  const user = userEvent.setup()

  render(
    <>
      <ProgressiveNav content={navigationContent} currentLocale="en" />
      <main>
        <button type="button">Outside control</button>
      </main>
    </>,
  )

  await user.click(screen.getByRole("button", { name: "Sections" }))
  expect(screen.getByRole("link", { name: "Thesis" })).toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "Outside control" }))

  expect(screen.queryByRole("link", { name: "Thesis" })).toBeNull()
  expect(screen.getByRole("button", { name: "Sections" })).toHaveAttribute(
    "aria-expanded",
    "false",
  )
})

it("closes the quick menu after a chapter destination is chosen", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Sections" }))
  await user.click(screen.getByRole("link", { name: "Founder" }))

  expect(screen.getByRole("button", { name: "Sections" })).toHaveAttribute(
    "aria-expanded",
    "false",
  )
})

it("keeps the quick menu open when a touch clears focus instead of moving it", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Sections" }))

  const firstLink = screen.getByRole("link", { name: "Start" })
  expect(firstLink).toHaveFocus()

  // Tapping a link on iOS Safari drops focus without moving it to another element.
  fireEvent.focusOut(firstLink, { relatedTarget: null })

  expect(screen.getByRole("link", { name: "Founder" })).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Sections" })).toHaveAttribute(
    "aria-expanded",
    "true",
  )
})

it("closes the quick menu when focus moves to content outside the navigation", async () => {
  const user = userEvent.setup()

  render(
    <>
      <ProgressiveNav content={navigationContent} currentLocale="en" />
      <main>
        <button type="button">Outside control</button>
      </main>
    </>,
  )

  await user.click(screen.getByRole("button", { name: "Sections" }))

  fireEvent.focusOut(screen.getByRole("link", { name: "Start" }), {
    relatedTarget: screen.getByRole("button", { name: "Outside control" }),
  })

  expect(screen.queryByRole("link", { name: "Start" })).toBeNull()
})

it("keeps one persistent language control when the quick menu opens", async () => {
  const user = userEvent.setup()

  render(<ProgressiveNav content={navigationContent} currentLocale="en" />)

  await user.click(screen.getByRole("button", { name: "Sections" }))

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
