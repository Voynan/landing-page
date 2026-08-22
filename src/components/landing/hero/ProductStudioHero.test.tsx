// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import { ProductStudioHero } from "@/components/landing/hero/ProductStudioHero"
import { getLandingContent } from "@/content"
import type { AllowedEvent } from "@/lib/analytics"

afterEach(cleanup)

describe("ProductStudioHero", () => {
  it.each(["pt", "en"] as const)(
    "renders useful %s hero content without animation",
    (locale) => {
      render(<ProductStudioHero content={getLandingContent(locale).hero} />)

      expect(screen.getByRole("heading", { level: 1 })).toBeVisible()
      expect(screen.getAllByRole("link")).toHaveLength(2)
      expect(
        screen.getByText(getLandingContent(locale).hero.support),
      ).toBeVisible()
    },
  )

  it("reports both hero conversion choices without changing their links", async () => {
    const user = userEvent.setup()
    const events: AllowedEvent[] = []

    render(
      <ProductStudioHero
        content={getLandingContent("en").hero}
        trackEvent={(event) => events.push(event)}
      />,
    )

    const productLink = screen.getByRole("link", { name: /products/i })
    const contactLink = screen.getByRole("link", { name: /build with us/i })

    await user.click(productLink)
    await user.click(contactLink)

    expect(productLink).toHaveAttribute("href", "#products")
    expect(contactLink).toHaveAttribute("href", "#contact")
    expect(events).toEqual([
      { name: "hero_product_click" },
      { name: "hero_contact_click" },
    ])
  })
})
