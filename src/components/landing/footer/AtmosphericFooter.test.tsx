// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { ConsentBanner } from "@/components/consent/ConsentBanner"
import { AtmosphericFooter } from "@/components/landing/footer/AtmosphericFooter"
import { getLandingContent } from "@/content"
import { ANALYTICS_CONSENT_STORAGE_KEY } from "@/lib/analyticsConsent"

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
  developmentStatus: "In development",
  cookiePreferences: "Cookie preferences",
} as const

afterEach(cleanup)
beforeEach(() => window.localStorage.clear())

it("renders every footer group without inventing pending destinations", () => {
  render(
    <AppProviders initialLocale="en">
      <AtmosphericFooter content={getLandingContent("en")} labels={labels} />
    </AppProviders>,
  )

  const footer = screen.getByRole("contentinfo", {
    name: labels.sectionLabel,
  })

  expect(within(footer).getByText("Voynan")).toBeVisible()
  expect(within(footer).getByText(labels.tagline)).toBeVisible()
  expect(within(footer).getByText("CryptoVault")).toBeVisible()
  expect(within(footer).getByText("BullLedger")).toBeVisible()
  expect(
    within(footer).getByRole("link", {
      name: "Constrully — In development",
    }),
  ).toBeVisible()
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
  ).toHaveAttribute("href", "/privacy")
  expect(within(footer).getByRole("link", { name: "Terms" })).toHaveAttribute(
    "href",
    "/terms",
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
    <AppProviders initialLocale="en">
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
      />
    </AppProviders>,
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

it("reopens the analytics choice from the legal column and returns focus there", async () => {
  window.localStorage.setItem(
    ANALYTICS_CONSENT_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      choice: "granted",
      decidedAt: new Date().toISOString(),
    }),
  )
  const user = userEvent.setup()
  const runtime = { start: vi.fn(), setConsent: vi.fn() }

  render(
    <AppProviders
      initialLocale="en"
      analyticsEnabled
      analyticsRuntime={runtime}
    >
      <ConsentBanner />
      <AtmosphericFooter content={getLandingContent("en")} labels={labels} />
    </AppProviders>,
  )

  const legal = screen.getByRole("navigation", { name: labels.legal })
  const preferences = within(legal).getByRole("button", {
    name: labels.cookiePreferences,
  })

  expect(
    screen.queryByRole("region", { name: "Analytics cookies" }),
  ).not.toBeInTheDocument()

  await user.click(preferences)
  const banner = screen.getByRole("region", { name: "Analytics cookies" })
  expect(banner).toHaveFocus()

  await user.click(within(banner).getByRole("button", { name: "Decline" }))

  expect(runtime.setConsent).toHaveBeenLastCalledWith(false)
  expect(preferences).toHaveFocus()
})

it("offers no cookie preferences when analytics is not configured", () => {
  render(
    <AppProviders initialLocale="en">
      <AtmosphericFooter content={getLandingContent("en")} labels={labels} />
    </AppProviders>,
  )

  expect(
    screen.queryByRole("button", { name: labels.cookiePreferences }),
  ).not.toBeInTheDocument()
})
