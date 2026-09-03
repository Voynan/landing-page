// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
    "Forms",
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

  const controls = screen.getByRole("region", { name: "Controls" })

  expect(screen.getByRole("button", { name: "Primary" })).toBeEnabled()
  expect(screen.getByRole("button", { name: "Open sheet" })).toBeEnabled()
  expect(within(controls).getByRole("textbox", { name: "Email" })).toBeEnabled()
  expect(screen.getByRole("link", { name: "Explore products" })).toBeVisible()
  expect(screen.getByRole("group", { name: "Language" })).toBeVisible()
  expect(within(controls).getByRole("link", { name: "PT" })).toBeVisible()
  expect(within(controls).getByRole("link", { name: "EN" })).toBeVisible()
  expect(
    within(controls).getByRole("group", {
      name: "Section index at 320 pixels",
    }),
  ).toBeVisible()
  expect(
    within(controls).getByRole("list", { name: "Section index" }),
  ).toBeVisible()
})

it("documents duration and easing contracts in the motion specimen", () => {
  render(<DesignSystemPage />)

  const motion = screen.getByRole("region", { name: "Motion" })

  expect(within(motion).getByText("--ease-standard")).toBeVisible()
  expect(within(motion).getByText("cubic-bezier(0.4, 0, 0.2, 1)")).toBeVisible()
})

it("exercises every eclipse state without scroll pin and compares reduced motion", async () => {
  const user = userEvent.setup()
  render(<DesignSystemPage />)

  const motion = screen.getByRole("region", { name: "Motion" })
  const states = within(motion).getByRole("list", {
    name: "Eclipse thread states",
  })
  expect(within(states).getAllByTestId("eclipse-thread")).toHaveLength(8)

  const controls = within(motion).getByRole("group", {
    name: "Eclipse state controls",
  })
  const flow = within(controls).getByRole("button", { name: "Flow" })
  await user.click(flow)
  expect(flow).toHaveAttribute("aria-pressed", "true")

  const comparison = within(motion).getByRole("group", {
    name: "Motion comparison",
  })
  const [standard, reduced] =
    within(comparison).getAllByTestId("eclipse-thread")
  expect(standard).toHaveAttribute("data-state", "flow")
  expect(standard).toHaveAttribute("data-motion", "enhanced")
  expect(reduced).toHaveAttribute("data-state", "flow")
  expect(reduced).toHaveAttribute("data-motion", "static")

  const preview = within(comparison).getByTestId("motion-standard-preview")
  const replay = within(motion).getByRole("button", {
    name: "Replay selected state",
  })
  expect(preview).toHaveAttribute("data-replay", "0")
  await user.click(replay)
  expect(preview).toHaveAttribute("data-replay", "1")
  expect(replay).toHaveFocus()
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

it("renders every production contact state in the forms specimen", () => {
  render(<DesignSystemPage />)

  const forms = screen.getByRole("region", { name: "Forms" })

  for (const state of [
    "Empty",
    "Invalid",
    "Submitting",
    "Success",
    "Failure",
    "Clipboard fallback",
  ]) {
    expect(within(forms).getByText(state)).toBeVisible()
  }

  expect(forms.querySelectorAll("form")).toHaveLength(6)

  expect(
    within(forms)
      .getAllByLabelText("Name")
      .some((field) => !field.hasAttribute("disabled")),
  ).toBe(true)
  expect(
    within(forms)
      .getAllByLabelText("Email")
      .some((field) => !field.hasAttribute("disabled")),
  ).toBe(true)
  expect(
    within(forms)
      .getAllByLabelText("Message")
      .some((field) => !field.hasAttribute("disabled")),
  ).toBe(true)
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
