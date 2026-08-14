// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { DesignSystemHead } from "@/pages/design-system/DesignSystemHead"
import { DesignSystemPage } from "@/pages/design-system/DesignSystemPage"

afterEach(cleanup)

it("renders every foundational specimen as a named region", () => {
  render(<DesignSystemPage />)

  for (const name of [
    "Foundations",
    "Typography",
    "Layout",
    "Controls",
    "Content stress",
    "Media",
    "Motion",
    "Accessibility",
  ]) {
    expect(screen.getByRole("region", { name })).toBeVisible()
  }
})

it("exposes one page heading and local specimen navigation", () => {
  render(<DesignSystemPage />)

  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  expect(
    screen.getByRole("navigation", { name: "Design system sections" }),
  ).toBeVisible()
})

it("keeps the current specimen exposed in the sticky index", () => {
  render(<DesignSystemPage />)

  const foundations = screen.getByRole("link", { name: "Foundations" })
  const media = screen.getByRole("link", { name: "Media" })

  expect(foundations).toHaveAttribute("aria-current", "location")
  fireEvent.click(media)
  expect(media).toHaveAttribute("aria-current", "location")
  expect(foundations).not.toHaveAttribute("aria-current")
})

it("renders measured contrast pairings and a calibration ruler", () => {
  render(<DesignSystemPage />)

  const foundations = screen.getByRole("region", { name: "Foundations" })

  expect(
    within(foundations).getByLabelText("Contrast compatibility"),
  ).toBeVisible()
  expect(within(foundations).getByText("17.20:1 · AAA")).toBeVisible()
  expect(within(foundations).getByLabelText("Calibration ruler")).toBeVisible()
})

it("renders both official Voynan brand marks", () => {
  render(<DesignSystemPage />)

  const foundations = screen.getByRole("region", { name: "Foundations" })

  expect(
    within(foundations).getByRole("img", { name: "Voynan wordmark" }),
  ).toBeVisible()
  expect(
    within(foundations).getByRole("img", { name: "Voynan eclipse icon" }),
  ).toBeVisible()
})

it("renders production controls inside the controls specimen", () => {
  render(<DesignSystemPage />)

  expect(screen.getByRole("button", { name: "Primary" })).toBeEnabled()
  expect(screen.getByRole("button", { name: "Open sheet" })).toBeEnabled()
  expect(screen.getByRole("textbox", { name: "Email" })).toBeEnabled()
})

it("documents duration and easing contracts in the motion specimen", () => {
  render(<DesignSystemPage />)

  const motion = screen.getByRole("region", { name: "Motion" })

  expect(within(motion).getByText("--ease-standard")).toBeVisible()
  expect(within(motion).getByText("cubic-bezier(0.4, 0, 0.2, 1)")).toBeVisible()
})

it("renders the production media component across its resilient states", () => {
  render(<DesignSystemPage />)

  const media = screen.getByRole("region", { name: "Media" })

  expect(within(media).getAllByTestId("product-media")).toHaveLength(5)
  expect(within(media).getByText("Poster")).toBeVisible()
  expect(within(media).getByText("Loading")).toBeVisible()
  expect(within(media).getByText("Ready")).toBeVisible()
  expect(within(media).getByText("Error")).toBeVisible()
  expect(within(media).getByText("Reduced data")).toBeVisible()
})

it("keeps the internal page out of search indexes", () => {
  render(<DesignSystemHead />)

  expect(document.title).toBe("Voynan Design System")
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  )
  expect(
    document.head.querySelector('meta[property^="og:"]'),
  ).not.toBeInTheDocument()
})
