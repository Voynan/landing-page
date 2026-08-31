// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { ProductProgressIndex } from "@/components/landing/products/ProductProgressIndex"
import { getLandingContent } from "@/content"

afterEach(cleanup)

it("exposes four direct product destinations and the current step", async () => {
  const onSelect = vi.fn()
  const user = userEvent.setup()

  render(
    <ProductProgressIndex
      activeProductId="bullledger"
      developmentStatus="Em desenvolvimento"
      label="Navegação dos produtos"
      onSelect={onSelect}
      productionStatus="Em produção"
      products={getLandingContent("pt").products.items}
    />,
  )

  const nav = screen.getByRole("navigation", {
    name: "Navegação dos produtos",
  })
  const links = within(nav).getAllByRole("link")
  expect(links).toHaveLength(4)
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "#product-cryptovault-segment",
    "#product-bullledger-segment",
    "#product-safenumber-segment",
    "#product-constrully-segment",
  ])
  expect(links[1]).toHaveAttribute("aria-current", "step")
  expect(links[3]).toHaveTextContent("Em desenvolvimento")

  await user.click(links[2])
  expect(onSelect).toHaveBeenCalledWith("safenumber")
})
