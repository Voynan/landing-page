// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { ProductPanel } from "@/components/landing/products/ProductPanel"
import { getLandingContent } from "@/content"

const labels = {
  conceptualEvidence: "Representação conceitual",
  destinationPending: "Destino aguardando aprovação",
  productionStatus: "Em produção",
  developmentStatus: "Em desenvolvimento",
}

afterEach(cleanup)

it("keeps a complete product article available in linear mode", () => {
  const product = getLandingContent("pt").products.items[2]

  render(
    <ProductPanel
      active={false}
      enhanced={false}
      labels={labels}
      product={product}
      trackEvent={vi.fn()}
    />,
  )

  const article = screen.getByRole("article", { name: product.title })
  expect(article).toHaveAttribute("id", `product-${product.id}`)
  expect(article).not.toHaveAttribute("aria-hidden")
  expect(article).not.toHaveAttribute("inert")
  expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
    product.title,
  )
  expect(screen.getByText("Em produção")).toBeVisible()
})

it("supports an isolated DOM id namespace for alternate presentations", () => {
  const product = getLandingContent("pt").products.items[2]

  render(
    <ProductPanel
      active
      domIdPrefix="mobile-product"
      enhanced={false}
      labels={labels}
      product={product}
      trackEvent={vi.fn()}
    />,
  )

  const article = screen.getByRole("article", { name: product.title })
  expect(article).toHaveAttribute("id", `mobile-product-${product.id}`)
  expect(article).toHaveAttribute(
    "aria-labelledby",
    `mobile-product-${product.id}-title`,
  )
})

it("keeps the destination with the product introduction", () => {
  const product = getLandingContent("pt").products.items[1]

  const view = render(
    <ProductPanel
      active
      enhanced
      labels={labels}
      product={product}
      trackEvent={vi.fn()}
    />,
  )

  const article = screen.getByRole("article", { name: product.title })
  const introduction = article.querySelector("header")
  const details = article.querySelector("footer") as HTMLElement

  expect(introduction).toContainElement(
    screen.getByRole("heading", { level: 3, name: product.title }),
  )
  expect(introduction).toContainElement(
    within(introduction as HTMLElement).getByRole("link", {
      name: new RegExp(product.destination.label),
    }),
  )
  expect(details).toContainElement(within(details).getByRole("list"))
  expect(within(details).queryByRole("link")).not.toBeInTheDocument()
  expect(
    view.container.querySelector(".product-panel__evidence"),
  ).not.toBeNull()
})

it("makes an inactive enhanced panel unfocusable and preserves click analytics", () => {
  const product = getLandingContent("pt").products.items[0]
  const trackEvent = vi.fn()
  const approvedProduct = {
    ...product,
    destination: {
      ...product.destination,
      href: "https://example.com/cryptovault",
      approval: "approved" as const,
    },
  }
  const view = render(
    <ProductPanel
      active={false}
      enhanced
      labels={labels}
      product={approvedProduct}
      trackEvent={trackEvent}
    />,
  )

  const article = view.container.querySelector("article")!
  expect(article).toHaveAttribute("aria-hidden", "true")
  expect(article).toHaveAttribute("inert")

  view.rerender(
    <ProductPanel
      active
      enhanced
      labels={labels}
      product={approvedProduct}
      trackEvent={trackEvent}
    />,
  )
  fireEvent.click(screen.getByRole("link", { name: /CryptoVault/ }))
  expect(trackEvent).toHaveBeenCalledWith({
    name: "product_click",
    productId: "cryptovault",
  })
})
