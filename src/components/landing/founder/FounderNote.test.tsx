// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { FounderNote } from "@/components/landing/founder/FounderNote"
import { getLandingContent } from "@/content"

const labels = {
  sectionLabel: "Founder",
  profilePending: "Founder profile awaiting approval",
  portraitPending: "Portrait awaiting approval",
  socialLabel: "Founder profiles",
  socialPending: "Destination awaiting approval",
} as const

afterEach(cleanup)

it.each([
  {
    locale: "pt" as const,
    role: "Fundador e engenheiro principal",
    note: "Comecei a Voynan para construir os produtos que eu queria usar e, depois, operá-los todos os dias. Cada sistema que entrego a um cliente passa pelo mesmo critério: precisa continuar funcionando quando ninguém está olhando. É esse padrão que ofereço a quem constrói conosco.",
    portraitAlt:
      "Retrato em pixel art de Kaio Vinícios, de braços cruzados e usando camiseta preta.",
  },
  {
    locale: "en" as const,
    role: "Founder and principal engineer",
    note: "I started Voynan to build the products I wanted to use, and then to run them every day. Every system I hand to a client meets the same bar: it has to keep working when nobody is watching. That standard is what I bring to everyone who builds with us.",
    portraitAlt:
      "Pixel-art portrait of Kaio Vinícios with his arms crossed, wearing a black T-shirt.",
  },
])(
  "renders the approved founder profile in $locale",
  ({ locale, note, portraitAlt, role }) => {
    render(
      <FounderNote
        content={getLandingContent(locale).founder}
        labels={labels}
      />,
    )

    const portrait = screen.getByRole("img", { name: portraitAlt })

    expect(screen.getByRole("heading", { name: "Kaio Vinícios" })).toBeVisible()
    expect(screen.getByText(role)).toBeVisible()
    expect(screen.getByText(note)).toBeVisible()
    expect(portrait).toHaveAttribute("width", "1024")
    expect(portrait).toHaveAttribute("height", "1536")
    expect(
      screen.queryByText(/src\/assets\/pixelated_portrait\.png/i),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(labels.profilePending)).not.toBeInTheDocument()
    expect(screen.queryByText(labels.portraitPending)).not.toBeInTheDocument()
  },
)

it("keeps unapproved founder identity and portrait out of the page", () => {
  const base = getLandingContent("en").founder

  render(
    <FounderNote
      content={{
        ...base,
        profile: {
          role: "Founder and principal engineer",
          approval: "missing",
        },
      }}
      labels={labels}
    />,
  )

  expect(screen.getByText(labels.profilePending)).toBeInTheDocument()
  expect(screen.getByText(labels.portraitPending)).toBeInTheDocument()
  expect(screen.queryByRole("img")).not.toBeInTheDocument()
  expect(screen.queryByText(/Kaio/i)).not.toBeInTheDocument()
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/kaiovinicios/",
  )
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/KaioVinicios",
  )
})

it("groups the approved portrait in its visual frame", () => {
  const portraitAlt =
    "Pixel-art portrait of Kaio Vinícios with his arms crossed, wearing a black T-shirt."

  render(
    <FounderNote content={getLandingContent("en").founder} labels={labels} />,
  )

  const frame = screen.getByRole("figure")
  const portrait = screen.getByRole("img", { name: portraitAlt })

  expect(frame).toContainElement(portrait)
})

it("names every founder profile from its icon, without visible labels", () => {
  render(
    <FounderNote content={getLandingContent("en").founder} labels={labels} />,
  )

  const social = screen.getByRole("navigation", { name: labels.socialLabel })

  for (const name of ["LinkedIn", "X", "GitHub"]) {
    const link = within(social).getByRole("link", { name })
    expect(link).toHaveTextContent("")
    expect(link.querySelector("svg.social-icon")).toBeInTheDocument()
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  }
})

it("marks a social destination as pending until it is approved", () => {
  const base = getLandingContent("en").founder

  render(
    <FounderNote
      labels={labels}
      content={{
        ...base,
        social: [
          { platform: "linkedin", label: "LinkedIn", approval: "missing" },
        ],
      }}
    />,
  )

  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "aria-disabled",
    "true",
  )
  expect(screen.getByText(labels.socialPending)).toBeInTheDocument()
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
        social: [
          {
            platform: "linkedin",
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/example",
            approval: "approved",
          },
        ],
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
