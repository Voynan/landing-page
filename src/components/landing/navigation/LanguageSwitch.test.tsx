// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, it } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import type { AllowedEvent } from "@/lib/analytics"

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, "", "/")
})

afterEach(cleanup)

it("exposes crawlable locale links that carry the active chapter", () => {
  render(
    <AppProviders initialLocale="en">
      <LanguageSwitch
        activeSectionId="products"
        label="Language"
        localeLabels={{ en: "English", pt: "Portuguese" }}
      />
    </AppProviders>,
  )

  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "aria-current",
    "page",
  )
  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "href",
    "/?lang=pt#products",
  )
})

it("keeps the locale query on the page it is rendered on", () => {
  render(
    <AppProviders initialLocale="en">
      <LanguageSwitch
        label="Language"
        localeLabels={{ en: "English", pt: "Portuguese" }}
        path="/privacy"
      />
    </AppProviders>,
  )

  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "href",
    "/privacy?lang=pt",
  )
})

it("switches language in place without navigating", async () => {
  const user = userEvent.setup()
  const events: AllowedEvent[] = []

  render(
    <AppProviders initialLocale="en">
      <LanguageSwitch
        label="Language"
        localeLabels={{ en: "English", pt: "Portuguese" }}
        trackEvent={(event) => events.push(event)}
      />
    </AppProviders>,
  )

  await user.click(screen.getByRole("link", { name: "Portuguese" }))

  expect(events).toEqual([{ name: "language_change", from: "en", to: "pt" }])
  expect(window.location.pathname).toBe("/")
  expect(window.location.search).toBe("?lang=pt")
  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "aria-current",
    "page",
  )
})

it("does not emit an event when the active locale is clicked again", async () => {
  const user = userEvent.setup()
  const events: AllowedEvent[] = []

  render(
    <AppProviders initialLocale="en">
      <LanguageSwitch
        label="Language"
        localeLabels={{ en: "English", pt: "Portuguese" }}
        trackEvent={(event) => events.push(event)}
      />
    </AppProviders>,
  )

  await user.click(screen.getByRole("link", { name: "English" }))

  expect(events).toEqual([])
})
