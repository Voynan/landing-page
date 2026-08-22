// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { BuildWithUsFlow } from "@/components/landing/services/BuildWithUsFlow"
import { getLandingContent } from "@/content"

const labels = {
  sectionLabel: "Services",
  destinationPending: "Contact destination arrives in the next phase",
} as const

afterEach(cleanup)

it("renders the four service layers in contractual order", () => {
  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  const layers = screen.getAllByRole("article")

  expect(layers).toHaveLength(4)
  expect(
    layers.map((layer) => within(layer).getByRole("heading").textContent),
  ).toEqual([
    "Build",
    "Connect and automate",
    "Operate with confidence",
    "Expand frontiers",
  ])
})

it("keeps the approved CTA label without linking to a missing section", () => {
  render(
    <BuildWithUsFlow
      content={getLandingContent("en").services}
      labels={labels}
    />,
  )

  const cta = screen.getByRole("link", { name: "Start a conversation" })

  expect(cta).toHaveAttribute("aria-disabled", "true")
  expect(cta).not.toHaveAttribute("href")
  expect(screen.getByText(labels.destinationPending)).toBeInTheDocument()
})
