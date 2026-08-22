// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { LocaleLandingPage } from "@/pages/LocaleLandingPage"

afterEach(cleanup)

it.each([
  ["pt", "Navegação principal"],
  ["en", "Primary navigation"],
] as const)(
  "gives the %s navigation landmark its own label",
  (locale, label) => {
    render(<LocaleLandingPage locale={locale} />)

    expect(screen.getByRole("navigation", { name: label })).toBeVisible()
  },
)
