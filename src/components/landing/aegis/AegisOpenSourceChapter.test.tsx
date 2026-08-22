// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import userEvent from "@testing-library/user-event"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { AegisOpenSourceChapter } from "@/components/landing/aegis/AegisOpenSourceChapter"
import { RealCodeSample } from "@/components/landing/aegis/RealCodeSample"
import { getLandingContent } from "@/content"
import type { AllowedEvent } from "@/lib/analytics"

const labels = {
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
} as const

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it("renders coming soon without a fake terminal or invented code", () => {
  render(
    <AegisOpenSourceChapter
      content={getLandingContent("en").aegis}
      labels={labels}
    />,
  )

  expect(screen.getByText(/Coming soon/i)).toBeInTheDocument()
  expect(screen.getByText(labels.evidencePending)).toBeInTheDocument()
  expect(document.querySelector("code")).not.toBeInTheDocument()
  expect(
    screen.getByRole("navigation", { name: labels.linksLabel }),
  ).toBeInTheDocument()
  const githubLink = screen.getByRole("link", { name: "View on GitHub" })
  expect(githubLink).toHaveAttribute("aria-disabled", "true")
  const pendingDescriptionId = githubLink.getAttribute("aria-describedby")
  expect(pendingDescriptionId).toBeTruthy()
  expect(document.getElementById(pendingDescriptionId ?? "")).toHaveTextContent(
    labels.linkPending,
  )
  expect(
    screen.getByRole("link", { name: "Read the docs" }),
  ).not.toHaveAttribute("href")
})

it("renders approved technical evidence and destinations", () => {
  const base = getLandingContent("en").aegis

  render(
    <AegisOpenSourceChapter
      labels={labels}
      content={{
        ...base,
        github: {
          label: "View on GitHub",
          href: "https://github.com/voynan/aegis",
          approval: "approved",
        },
        documentation: {
          label: "Read the docs",
          href: "https://docs.voynan.com/aegis",
          approval: "approved",
        },
        technicalEvidence: {
          releaseStatus: "Private beta",
          license: "MIT",
          code: 'await aegis.encrypt("report.pdf")',
          environments: ["Browser", "Node.js"],
          source: "Aegis repository",
          approval: "approved",
        },
      }}
    />,
  )

  expect(document.querySelector("code")).toHaveTextContent(
    'await aegis.encrypt("report.pdf")',
  )
  expect(
    screen.getByRole("group", { name: labels.sectionLabel }),
  ).toBeInTheDocument()
  expect(screen.getByText(labels.releaseLabel)).toBeInTheDocument()
  expect(screen.getByText("Private beta")).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/voynan/aegis",
  )
})

it("reports each approved Aegis destination", async () => {
  const user = userEvent.setup()
  const events: AllowedEvent[] = []
  const base = getLandingContent("en").aegis

  render(
    <AegisOpenSourceChapter
      labels={labels}
      trackEvent={(event) => events.push(event)}
      content={{
        ...base,
        github: {
          label: "View on GitHub",
          href: "https://github.com/voynan/aegis",
          approval: "approved",
        },
        documentation: {
          label: "Read the docs",
          href: "https://docs.voynan.com/aegis",
          approval: "approved",
        },
      }}
    />,
  )

  await user.click(screen.getByRole("link", { name: "View on GitHub" }))
  await user.click(screen.getByRole("link", { name: "Read the docs" }))

  expect(events).toEqual([
    { name: "aegis_github_click" },
    { name: "aegis_docs_click" },
  ])
})

it("copies an exact real sample and announces success", async () => {
  const user = userEvent.setup()
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue(undefined)

  render(
    <RealCodeSample
      code={'await aegis.encrypt("report.pdf")'}
      labels={labels}
    />,
  )

  await user.click(screen.getByRole("button", { name: labels.copyCode }))

  expect(writeText).toHaveBeenCalledWith('await aegis.encrypt("report.pdf")')
  expect(screen.getByRole("status")).toHaveTextContent(labels.copied)
})

it("keeps code selectable and announces clipboard failure", async () => {
  const user = userEvent.setup()

  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
    new Error("denied"),
  )

  render(
    <RealCodeSample
      code={'await aegis.encrypt("report.pdf")'}
      labels={labels}
    />,
  )

  await user.click(screen.getByRole("button", { name: labels.copyCode }))

  expect(document.querySelector("code")).toHaveTextContent(
    'await aegis.encrypt("report.pdf")',
  )
  expect(screen.getByRole("status")).toHaveTextContent(labels.copyFailed)
})
