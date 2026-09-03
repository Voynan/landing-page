// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { afterEach, expect, it, vi } from "vitest"

import { LandingShell } from "@/components/landing/LandingShell"
import { getLandingContent } from "@/content"
import { createQueryClient } from "@/lib/queryClient"
import { motionQueries } from "@/components/motion/motionQueries"
import { ScrollTrigger } from "@/lib/gsap"

const navigationContent = {
  ariaLabel: "Primary navigation",
  homeLabel: "Voynan — back to start",
  languageLabel: "Language",
  localeLabels: { en: "English", pt: "Portuguese" },
  menuLabel: "Sections",
  links: [
    { label: "Start", sectionId: "hero" },
    { label: "Thesis", sectionId: "thesis" },
    { label: "Products", sectionId: "products" },
    { label: "Build with us", sectionId: "services" },
    { label: "Open source", sectionId: "aegis" },
    { label: "Founder", sectionId: "founder" },
    { label: "Contact", sectionId: "contact" },
  ],
} as const

const productStageLabels = {
  sectionLabel: "Products",
  progressLabel: "Product chapters",
  conceptualEvidence: "Conceptual representation",
  destinationPending: "Destination awaiting approval",
  productionStatus: "In production",
  developmentStatus: "In development",
  productionShortStatus: "Live",
  developmentShortStatus: "Dev.",
  mobileGridLabel: "Choose a product",
  mobileInteractionHint: "Tap a product to see details",
  collapseProduct: "Close details",
  previousProduct: "Previous product",
  nextProduct: "Next product",
} as const

const supportingChapterLabels = {
  credibility: {
    sectionLabel: "Credibility",
    pendingTitle: "Evidence review in progress",
    pendingSupport: "Verified evidence will appear after approval.",
    metricsLabel: "Verified metrics",
    testimonialsLabel: "Testimonials",
  },
  services: {
    sectionLabel: "Services",
    destinationPending: "Contact destination arrives in the next phase",
  },
  aegis: {
    sectionLabel: "Open source",
    evidencePending: "Real code awaiting approval",
    linkPending: "Destination awaiting approval",
    linksLabel: "Aegis technical links",
    copyCode: "Copy code",
    copied: "Code copied",
    copyFailed: "Copy unavailable; select the code manually",
    releaseLabel: "Release status",
    licenseLabel: "License",
    environmentsLabel: "Environments",
    sourceLabel: "Source",
  },
  founder: {
    sectionLabel: "Founder",
    profilePending: "Founder profile awaiting approval",
    portraitPending: "Portrait awaiting approval",
    socialLabel: "Founder profiles",
    socialPending: "Destination awaiting approval",
  },
  contact: {
    sectionLabel: "Contact",
    fields: { name: "Name", email: "Email", message: "Message" },
    validation: {
      required: "Complete this field.",
      email: "Enter a valid email address.",
      summary: "Review the highlighted fields.",
    },
    status: {
      submitting: "Sending…",
      success: "Message sent.",
      failure: "The message could not be sent.",
      timeout: "The request timed out. Try again or use email.",
      unavailable: "Submission is awaiting secure configuration.",
    },
    feedback: {
      copyEmail: "Copy email",
      emailCopied: "Email copied",
      copyUnavailable: "Select the email and copy it manually.",
      emailPending: "Public email awaiting approval.",
      manualEmailLabel: "Email for manual copying",
    },
    privacyNotice: "We use these details only to reply to this conversation.",
  },
  footer: {
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
  },
} as const

afterEach(() => {
  cleanup()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
})

it("provides one page heading, a skip link, and stable chapter identifiers", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === motionQueries.reduceMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })),
  )

  render(
    <QueryClientProvider client={createQueryClient()}>
      <LandingShell
        content={getLandingContent("en")}
        navigationContent={navigationContent}
        productStageLabels={productStageLabels}
        skipLinkLabel="Skip to content"
        supportingChapterLabels={supportingChapterLabels}
      />
    </QueryClientProvider>,
  )

  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content",
  )
  expect(document.querySelector("main#main-content")).toBeInTheDocument()
  expect(
    document.querySelector(
      "main#main-content > [data-testid='eclipse-thread-controller']",
    ),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole("contentinfo", { name: "Voynan footer" }),
  ).toBeInTheDocument()
  expect(document.querySelector("section#hero")).toBeInTheDocument()
  expect(document.querySelector("section#thesis")).toBeInTheDocument()
  expect(document.querySelector("section#products")).toBeInTheDocument()
  expect(
    Array.from(document.querySelectorAll("main > section")).map(
      (section) => section.id,
    ),
  ).toEqual([
    "hero",
    "thesis",
    "products",
    "credibility",
    "services",
    "aegis",
    "founder",
    "contact",
  ])

  const main = document.querySelector("main#main-content") as HTMLElement
  const footer = screen.getByRole("contentinfo", { name: "Voynan footer" })

  expect(within(main).getAllByTestId("pearlescent-starfield")).toHaveLength(8)
  expect(within(footer).queryByTestId("pearlescent-starfield")).toBeNull()

  const hero = document.querySelector("section#hero") as HTMLElement
  for (const product of getLandingContent("en").products.items) {
    expect(within(hero).queryByText(product.id)).toBeNull()
    expect(within(hero).queryByText(product.title)).toBeNull()
  }

  expect(
    Array.from(document.querySelectorAll("main > section")).map((section) =>
      section.getAttribute("data-motion-profile"),
    ),
  ).toEqual([
    "reduced",
    "reduced",
    "reduced",
    "reduced",
    "reduced",
    "reduced",
    "reduced",
    null,
  ])

  const productSection = document.querySelector("section#products")
  expect(productSection).toBeInTheDocument()
  expect(
    within(productSection as HTMLElement).getAllByRole("article"),
  ).toHaveLength(4)
})
