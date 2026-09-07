// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it } from "vitest"

import { LocaleLandingPage } from "@/pages/LocaleLandingPage"
import { localeHref } from "@/utils/locale"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

it.each([
  ["pt", "Navegação principal"],
  ["en", "Primary navigation"],
] as const)(
  "gives the %s navigation landmark its own label",
  (locale, label) => {
    window.history.replaceState(null, "", localeHref("/", locale))

    render(<LocaleLandingPage locale={locale} />)

    expect(screen.getByRole("navigation", { name: label })).toBeVisible()
  },
)
