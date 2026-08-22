// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { FounderNote } from "@/components/landing/founder/FounderNote"
import { getLandingContent } from "@/content"

const labels = {
  sectionLabel: "Founder",
  profilePending: "Founder profile awaiting approval",
  portraitPending: "Portrait awaiting approval",
  linkedInPending: "Destination awaiting approval",
} as const

afterEach(cleanup)

it("renders no invented identity for the real pending profile", () => {
  render(
    <FounderNote content={getLandingContent("en").founder} labels={labels} />,
  )

  expect(screen.getByText(labels.profilePending)).toBeInTheDocument()
  expect(screen.getByText(labels.portraitPending)).toBeInTheDocument()
  expect(screen.queryByRole("img")).not.toBeInTheDocument()
  expect(screen.queryByText(/Kai/i)).not.toBeInTheDocument()
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "aria-disabled",
    "true",
  )
})

it("renders an approved profile completely", () => {
  render(
    <FounderNote
      labels={labels}
      content={{
        id: "founder",
        profile: {
          name: "Kai",
          role: "Founder of Voynan",
          note: "Building products creates responsibility across experience, operations, and evolution.",
          portraitSrc: "/founder.webp",
          portraitAlt: "Kai in the Voynan studio",
          source: "Founder approval",
          approval: "approved",
        },
        linkedIn: {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/example",
          approval: "approved",
        },
      }}
    />,
  )

  const portrait = screen.getByRole("img", {
    name: "Kai in the Voynan studio",
  })
  const heading = screen.getByRole("heading", { name: "Kai" })

  expect(portrait).toHaveAttribute("width")
  expect(
    heading.compareDocumentPosition(portrait) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/example",
  )
})
