// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import {
  EclipseThread,
  type EclipseState,
} from "@/components/motion/EclipseThread"

afterEach(cleanup)

it("renders a meaningful final state under reduced motion", () => {
  render(<EclipseThread state="orbit" reducedMotion />)

  const thread = screen.getByTestId("eclipse-thread")
  expect(thread).toHaveClass("eclipse-thread")
  expect(thread).toHaveAttribute("data-motion", "static")
  expect(thread).toHaveAttribute("data-state", "orbit")
  expect(thread.querySelector('[data-eclipse-layer="orbit"]')).toHaveAttribute(
    "data-active",
    "true",
  )
})

it.each<EclipseState>([
  "ring",
  "line",
  "orbit",
  "evidence",
  "flow",
  "code",
  "signature",
  "closing-ring",
])("activates only the %s geometry", (state) => {
  render(<EclipseThread state={state} />)

  const thread = screen.getByTestId("eclipse-thread")
  const layers = thread.querySelectorAll<SVGGElement>("[data-eclipse-layer]")

  expect(thread).toHaveAttribute("data-motion", "enhanced")
  expect(layers).toHaveLength(8)
  expect(
    Array.from(layers).every((layer) => !layer.hasAttribute("style")),
  ).toBe(true)
  expect(
    Array.from(layers)
      .filter((layer) => layer.dataset.active === "true")
      .map((layer) => layer.dataset.eclipseLayer),
  ).toEqual([state])
})

it("updates the active geometry without exposing decorative SVG to assistive technology", () => {
  const { rerender } = render(<EclipseThread state="ring" />)

  rerender(<EclipseThread state="flow" />)

  const thread = screen.getByTestId("eclipse-thread")
  expect(thread).toHaveAttribute("aria-hidden", "true")
  expect(thread.querySelector('[data-eclipse-layer="ring"]')).toHaveAttribute(
    "data-active",
    "false",
  )
  expect(thread.querySelector('[data-eclipse-layer="flow"]')).toHaveAttribute(
    "data-active",
    "true",
  )
})
