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
  profilePending: "Founder profile awaiting approval",
  copyrightPending: "Copyright awaiting approval",
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
  expect(within(footer).getByText(labels.profilePending)).toBeVisible()
  expect(within(footer).getByText(labels.copyrightPending)).toBeVisible()
  expect(
    within(footer).getByRole("link", { name: "Privacy policy" }),
  ).toHaveAttribute("aria-disabled", "true")
  expect(
    within(footer).getByRole("link", { name: "View on GitHub" }),
  ).not.toHaveAttribute("href")
  expect(
    within(footer).getByRole("group", { name: labels.language }),
  ).toBeInTheDocument()
})

it("uses approved legal, contact, founder, and copyright facts completely", () => {
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
          linkedIn: {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/voynan",
            approval: "approved",
          },
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
          linkedIn: {
            label: "Founder LinkedIn",
            href: "https://www.linkedin.com/in/approved-founder",
            approval: "approved",
          },
        },
        footer: {
          copyrightHolder: "Voynan",
          copyrightNotice: "© 2026 Voynan. All rights reserved.",
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
  expect(screen.getByText("Approved founder")).toBeVisible()
  expect(screen.getByText("© 2026 Voynan. All rights reserved.")).toBeVisible()
})
