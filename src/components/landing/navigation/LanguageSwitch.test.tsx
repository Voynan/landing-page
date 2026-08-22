// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import type { AllowedEvent } from "@/lib/analytics"

afterEach(cleanup)

it("exposes native locale links and preserves the active chapter", async () => {
  const user = userEvent.setup()
  const onLocaleSelect = vi.fn()
  const events: AllowedEvent[] = []

  render(
    <LanguageSwitch
      activeSectionId="products"
      currentLocale="en"
      label="Language"
      localeLabels={{ en: "English", pt: "Portuguese" }}
      onLocaleSelect={onLocaleSelect}
      trackEvent={(event) => events.push(event)}
    />,
  )

  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "aria-current",
    "page",
  )
  expect(screen.getByRole("link", { name: "Portuguese" })).toHaveAttribute(
    "href",
    "/pt#products",
  )

  await user.click(screen.getByRole("link", { name: "Portuguese" }))
  expect(onLocaleSelect).toHaveBeenCalledWith("pt")
  expect(events).toEqual([{ name: "language_change", from: "en", to: "pt" }])
})
