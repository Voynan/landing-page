// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { ProductEvidence } from "@/components/landing/products/ProductEvidence"
import { getLandingContent, type LandingContentDraft } from "@/content"

const conceptualLabel = "Representação conceitual"

afterEach(cleanup)

it("renders a labeled conceptual flow from verified capabilities", () => {
  const product = getLandingContent("pt").products.items[2]

  render(
    <ProductEvidence product={product} conceptualLabel={conceptualLabel} />,
  )

  const figure = screen.getByRole("figure", {
    name: `${conceptualLabel}: SafeNumber`,
  })
  expect(figure).toHaveAttribute("data-product", "safenumber")
  expect(within(figure).getAllByRole("listitem")).toHaveLength(3)
  for (const capability of product.capabilities) {
    expect(within(figure).getByText(capability)).toBeVisible()
  }
  expect(screen.queryByRole("img")).not.toBeInTheDocument()
})

it("uses ProductMedia only when media is approved", () => {
  const original = getLandingContent("pt").products.items[0]
  const product = {
    ...original,
    media: {
      desktopSrc: "/crypto-desktop.webp",
      mobileSrc: "/crypto-mobile.webp",
      posterSrc: "/crypto-poster.webp",
      width: 1600,
      height: 900,
      alt: "Captura aprovada do CryptoVault",
      source: "Product owner",
      approval: "approved" as const,
    },
  } as LandingContentDraft["products"]["items"][number]

  render(
    <ProductEvidence product={product} conceptualLabel={conceptualLabel} />,
  )

  expect(screen.getByTestId("product-media")).toBeVisible()
  expect(
    screen.getByRole("img", { name: "Captura aprovada do CryptoVault" }),
  ).toBeVisible()
  expect(screen.queryByText(conceptualLabel)).not.toBeInTheDocument()
})
