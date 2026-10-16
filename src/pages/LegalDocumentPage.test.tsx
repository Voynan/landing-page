// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { LegalDocumentPage } from "@/pages/LegalDocumentPage"

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, "", "/privacy")
})
afterEach(cleanup)

it("lets visitors change their analytics choice from the privacy policy", () => {
  render(
    <AppProviders
      initialLocale="en"
      analyticsEnabled
      analyticsRuntime={{ start: vi.fn(), setConsent: vi.fn() }}
    >
      <LegalDocumentPage kind="privacy" />
    </AppProviders>,
  )

  expect(
    within(screen.getByRole("contentinfo")).getByRole("button", {
      name: "Cookie preferences",
    }),
  ).toBeVisible()
})

it("hides the control when analytics is not configured", () => {
  render(
    <AppProviders initialLocale="en">
      <LegalDocumentPage kind="privacy" />
    </AppProviders>,
  )

  expect(
    screen.queryByRole("button", { name: "Cookie preferences" }),
  ).not.toBeInTheDocument()
})
