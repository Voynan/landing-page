// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { afterEach, expect, it, vi } from "vitest"

import { MobileProductExplorer } from "@/components/landing/products/MobileProductExplorer"
import { getLandingContent, type ProductId } from "@/content"

const labels = {
  comingSoon: "Em breve",
  mediaCaption: {
    cryptovault: "Página inicial do produto",
    bullledger: "Dashboard inicial de exemplo",
  },
  destinationPending: "Destino aguardando aprovação",
  productionStatus: "Em produção",
  developmentStatus: "Em desenvolvimento",
  productionShortStatus: "Prod.",
  developmentShortStatus: "Desenv.",
  mobileGridLabel: "Escolha um produto",
  mobileInteractionHint: "Toque em um produto para ver detalhes",
  collapseProduct: "Fechar detalhes",
  previousProduct: "Produto anterior",
  nextProduct: "Próximo produto",
} as const

const products = getLandingContent("pt").products.items

afterEach(cleanup)

it("starts as a complete stacked product overview without an expanded panel", () => {
  render(
    <MobileProductExplorer
      activeProductId={null}
      labels={labels}
      onProductSelect={vi.fn()}
      products={products}
      reducedMotion={false}
      trackEvent={vi.fn()}
    />,
  )

  const explorer = screen.getByTestId("mobile-product-explorer")
  const grid = within(explorer).getByRole("group", {
    name: labels.mobileGridLabel,
  })

  expect(grid).toHaveAttribute("data-layout", "overview")
  expect(within(grid).getAllByRole("button")).toHaveLength(3)
  expect(screen.getByText(labels.mobileInteractionHint)).toBeVisible()
  expect(within(grid).getByText(products[2].title)).toBeVisible()
  expect(screen.queryByRole("article")).not.toBeInTheDocument()
})

it("compacts to one row and exposes only the selected product", async () => {
  const user = userEvent.setup()
  const onProductSelect = vi.fn()

  function Fixture() {
    const [activeProductId, setActiveProductId] = useState<ProductId | null>(
      null,
    )

    return (
      <MobileProductExplorer
        activeProductId={activeProductId}
        labels={labels}
        onProductSelect={(productId) => {
          setActiveProductId(productId)
          onProductSelect(productId)
        }}
        products={products}
        reducedMotion={false}
        trackEvent={vi.fn()}
      />
    )
  }

  render(<Fixture />)
  const bullLedgerButton = screen.getByRole("button", {
    name: /BullLedger, Em produção/,
  })

  await user.click(bullLedgerButton)

  expect(bullLedgerButton).toHaveAttribute(
    "aria-controls",
    "mobile-product-bullledger",
  )
  expect(
    screen.getByRole("group", { name: labels.mobileGridLabel }),
  ).toHaveAttribute("data-layout", "compact")
  expect(bullLedgerButton).toHaveAttribute("aria-expanded", "true")
  expect(
    screen.queryByText(labels.mobileInteractionHint),
  ).not.toBeInTheDocument()
  expect(screen.getByRole("article")).toHaveAttribute(
    "id",
    "mobile-product-bullledger",
  )
  expect(screen.getByRole("article")).toHaveAccessibleName(products[1].title)
  expect(screen.queryByText(products[0].support)).not.toBeInTheDocument()
  expect(onProductSelect).toHaveBeenCalledWith("bullledger")

  await user.click(bullLedgerButton)
  await waitFor(() => {
    expect(screen.queryByRole("article")).not.toBeInTheDocument()
  })
  expect(onProductSelect).toHaveBeenLastCalledWith(null)
})

it("moves between adjacent products without wrapping", async () => {
  const user = userEvent.setup()

  function Fixture() {
    const [activeProductId, setActiveProductId] = useState<ProductId | null>(
      "bullledger",
    )

    return (
      <MobileProductExplorer
        activeProductId={activeProductId}
        labels={labels}
        onProductSelect={setActiveProductId}
        products={products}
        reducedMotion
        trackEvent={vi.fn()}
      />
    )
  }

  render(<Fixture />)

  await user.click(screen.getByRole("button", { name: labels.nextProduct }))
  expect(screen.getByRole("article")).toHaveAccessibleName(products[2].title)
  expect(
    screen.getByRole("button", { name: labels.nextProduct }),
  ).toBeDisabled()

  await user.click(screen.getByRole("button", { name: labels.previousProduct }))
  expect(screen.getByRole("article")).toHaveAccessibleName(products[1].title)

  await user.click(screen.getByRole("button", { name: labels.collapseProduct }))
  expect(screen.queryByRole("article")).not.toBeInTheDocument()
})
