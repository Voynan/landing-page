// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { AtmosphericFooter } from "@/components/landing/footer/AtmosphericFooter"
import { getLandingContent } from "@/content"

const labels = {
  sectionLabel: "Voynan footer",
  tagline: "Building Digital Products",
  products: "Products",
  openSource: "Open source",
  contact: "Contact",
  company: "Company",
  legal: "Legal",
  founder: "Founder",
  language: "Language",
  destinationPending: "Destination awaiting approval",
  creatorNoticePending: "Creator notice awaiting approval",
} as const

afterEach(cleanup)

it("renders every footer group without inventing pending destinations", () => {
  render(
    <AtmosphericFooter content={getLandingContent("en")} labels={labels} />,
  )

  const footer = screen.getByRole("contentinfo", {
    name: labels.sectionLabel,
  })

  expect(within(footer).getByText("Voynan")).toBeVisible()
  expect(within(footer).getByText(labels.tagline)).toBeVisible()
  expect(within(footer).getByText("CryptoVault")).toBeVisible()
  expect(within(footer).getByText("InvestFusion")).toBeVisible()
  expect(within(footer).getByText("Constrully")).toBeVisible()
  expect(within(footer).getByText("Aegis")).toBeVisible()
  const company = within(footer).getByRole("navigation", {
    name: labels.company,
  })
  const contact = within(footer).getByRole("navigation", {
    name: labels.contact,
  })

  expect(
    within(company).getByRole("link", { name: labels.founder }),
  ).toHaveAttribute("href", "#founder")
  expect(within(company).getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/Voynan",
  )
  expect(
    within(contact).queryByRole("link", { name: "GitHub" }),
  ).not.toBeInTheDocument()
  expect(within(footer).queryByText("Kaio Vinícios")).not.toBeInTheDocument()
  expect(
    within(footer).queryByText("Founder and principal engineer"),
  ).not.toBeInTheDocument()
  expect(
    within(footer).getByText(
      "All featured products and services are created and maintained by Voynan.",
    ),
  ).toBeVisible()
  expect(
    within(footer).getByRole("link", { name: "Privacy policy" }),
  ).toHaveAttribute("href", "/en/privacy")
  expect(within(footer).getByRole("link", { name: "Terms" })).toHaveAttribute(
    "href",
    "/en/terms",
  )
  expect(
    within(footer).getByRole("link", { name: "View on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/Voynan/aegis")
  expect(
    within(footer).queryByRole("link", { name: "Read the docs" }),
  ).not.toBeInTheDocument()
  expect(within(footer).getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/Voynan",
  )
  expect(
    within(footer).getByRole("link", { name: "Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/voynan_/")
  expect(
    within(footer).getByRole("group", { name: labels.language }),
  ).toBeInTheDocument()
})

it("uses approved legal, contact, and creator facts completely", () => {
  const base = getLandingContent("en")

  render(
    <AtmosphericFooter
      labels={labels}
      content={{
        ...base,
        contact: {
          ...base.contact,
          publicEmail: {
            label: "Email",
            address: "hello@voynan.com",
            approval: "approved",
          },
          social: [
            {
              platform: "linkedin",
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/voynan",
              approval: "approved",
            },
          ],
          privacyPolicy: {
            label: "Privacy policy",
            href: "https://voynan.com/privacy",
            approval: "approved",
          },
          terms: {
            label: "Terms",
            href: "https://voynan.com/terms",
            approval: "approved",
          },
        },
        founder: {
          id: "founder",
          profile: {
            name: "Approved founder",
            role: "Founder of Voynan",
            note: "Approved founder note.",
            portraitSrc: "/founder.webp",
            portraitAlt: "Approved founder portrait",
            source: "Founder approval",
            approval: "approved",
          },
          social: [
            {
              platform: "linkedin",
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/approved-founder",
              approval: "approved",
            },
          ],
        },
        footer: {
          creatorNotice:
            "All featured products and services are created and maintained by Voynan.",
          approval: "approved",
        },
      }}
    />,
  )

  expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:hello@voynan.com",
  )
  expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "https://voynan.com/privacy",
  )
  expect(screen.queryByText("Approved founder")).not.toBeInTheDocument()
  expect(
    screen.getByText(
      "All featured products and services are created and maintained by Voynan.",
    ),
  ).toBeVisible()
})
