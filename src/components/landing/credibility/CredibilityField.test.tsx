// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { CredibilityField } from "@/components/landing/credibility/CredibilityField"
import { getLandingContent } from "@/content"

const labels = {
  sectionLabel: "Credibility",
  pendingTitle: "Evidence review in progress",
  pendingSupport: "Verified evidence will appear after approval.",
  metricsLabel: "Verified metrics",
  testimonialsLabel: "Testimonials",
} as const

afterEach(cleanup)

it("renders every approved item without carousel controls", () => {
  const base = getLandingContent("en").credibility

  render(
    <CredibilityField
      labels={labels}
      content={{
        ...base,
        metrics: [
          {
            value: "42%",
            period: "2026",
            definition: "Faster workflow",
            source: "Client report",
            approval: "approved",
          },
          {
            value: "3×",
            period: "Q2 2026",
            definition: "Deployment frequency",
            source: "Project telemetry",
            approval: "approved",
          },
          {
            value: "18h",
            period: "Monthly",
            definition: "Manual work removed",
            source: "Automation log",
            approval: "approved",
          },
        ],
        testimonials: [
          {
            quote: "The workflow became reliable.",
            name: "Ana",
            role: "COO",
            company: "Example",
            source: "Client project",
            permissions: {
              text: true,
              name: true,
              role: true,
              company: true,
              translation: true,
            },
            approval: "approved",
          },
          {
            quote: "We can now evolve safely.",
            name: "Leo",
            role: "CTO",
            company: "Example",
            source: "Client project",
            permissions: {
              text: true,
              name: true,
              role: true,
              company: true,
              translation: true,
            },
            approval: "approved",
          },
          {
            quote: "The product is easier to operate.",
            name: "Iara",
            role: "Founder",
            company: "Example",
            source: "SaaS product",
            permissions: {
              text: true,
              name: true,
              role: true,
              company: true,
              translation: true,
            },
            approval: "approved",
          },
        ],
      }}
    />,
  )

  expect(screen.getAllByRole("blockquote")).toHaveLength(3)
  expect(
    screen.getByRole("group", { name: labels.metricsLabel }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("group", { name: labels.testimonialsLabel }),
  ).toBeInTheDocument()
  expect(screen.getByText("42%")).toBeInTheDocument()
  expect(
    screen.queryByRole("button", { name: /next|previous/i }),
  ).not.toBeInTheDocument()
})

it("does not present missing evidence as metrics or testimonials", () => {
  render(
    <CredibilityField
      labels={labels}
      content={getLandingContent("en").credibility}
    />,
  )

  expect(screen.getByText(labels.pendingTitle)).toBeInTheDocument()
  expect(screen.getByText(labels.metricsLabel)).toBeInTheDocument()
  expect(screen.getByText(labels.testimonialsLabel)).toBeInTheDocument()
  expect(screen.getAllByText("0 / 03")).toHaveLength(2)
  expect(screen.queryByRole("blockquote")).not.toBeInTheDocument()
  expect(screen.queryByText(/42%|3×|18h/)).not.toBeInTheDocument()
})
