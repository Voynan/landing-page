// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it } from "vitest"

import { AppProviders } from "@/app/AppProviders"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { localeHref } from "@/utils/locale"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

it.each([
  ["en", "Page not found"],
  ["pt", "Página não encontrada"],
] as const)("renders the %s heading", (locale, heading) => {
  window.history.replaceState(null, "", localeHref("/", locale))

  render(
    <AppProviders initialLocale={locale}>
      <NotFoundPage />
    </AppProviders>,
  )

  expect(screen.getByRole("heading", { name: heading })).toBeVisible()
})

it("offers a link back to the home page", () => {
  window.history.replaceState(null, "", "/")

  render(
    <AppProviders initialLocale="en">
      <NotFoundPage />
    </AppProviders>,
  )

  expect(screen.getByRole("link", { name: "Back to Voynan" })).toHaveAttribute(
    "href",
    "/",
  )
})
