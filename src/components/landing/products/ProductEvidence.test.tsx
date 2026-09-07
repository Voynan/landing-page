// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { ProductEvidence } from "@/components/landing/products/ProductEvidence"
import { getLandingContent, type LandingContentDraft } from "@/content"

const comingSoonLabel = "Em breve"

const approvedMedia = {
  desktopSrc: "/crypto-desktop.webp",
  mobileSrc: "/crypto-mobile.webp",
  posterSrc: "/crypto-poster.webp",
  width: 1280,
  height: 800,
  alt: "Captura aprovada do CryptoVault",
  source: "Product owner",
  approval: "approved" as const,
}

const withMedia = (media: unknown) =>
  ({
    ...getLandingContent("pt").products.items[0],
    media,
  }) as LandingContentDraft["products"]["items"][number]

afterEach(cleanup)

it("presents the product mark and a coming-soon label when media is not approved", () => {
  const product = getLandingContent("pt").products.items[2]

  render(
    <ProductEvidence product={product} comingSoonLabel={comingSoonLabel} />,
  )

  const figure = screen.getByRole("figure")
  expect(figure).toHaveAttribute("data-product", "constrully")
  expect(within(figure).getByRole("img")).toBeVisible()
  expect(within(figure).getByText("Constrully")).toBeVisible()
  expect(within(figure).getByText(comingSoonLabel)).toBeVisible()
  expect(screen.queryByRole("list")).not.toBeInTheDocument()
})

it("uses ProductMedia only when media is approved", () => {
  render(
    <ProductEvidence
      product={withMedia(approvedMedia)}
      comingSoonLabel={comingSoonLabel}
    />,
  )

  expect(screen.getByTestId("product-media")).toBeVisible()
  expect(
    screen.getByRole("img", { name: "Captura aprovada do CryptoVault" }),
  ).toBeVisible()
  expect(screen.queryByText(comingSoonLabel)).not.toBeInTheDocument()
})

it("shows the localized caption supplied for the product", () => {
  render(
    <ProductEvidence
      product={withMedia(approvedMedia)}
      caption="Página inicial do produto"
      comingSoonLabel={comingSoonLabel}
    />,
  )

  expect(screen.getByText("Página inicial do produto")).toBeVisible()
})

it("reserves the mobile crop proportion when approved media declares one", () => {
  render(
    <ProductEvidence
      product={withMedia({
        ...approvedMedia,
        mobileWidth: 1040,
        mobileHeight: 1300,
      })}
      comingSoonLabel={comingSoonLabel}
    />,
  )

  const media = screen.getByTestId("product-media")

  expect(media.style.getPropertyValue("--product-media-ratio")).toBe(
    "1280 / 800",
  )
  expect(media.style.getPropertyValue("--product-media-ratio-mobile")).toBe(
    "1040 / 1300",
  )
  expect(media.querySelector("source")).toHaveAttribute(
    "media",
    "(max-width: 35rem)",
  )
})
