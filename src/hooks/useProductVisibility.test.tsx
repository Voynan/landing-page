// @vitest-environment jsdom

import { render } from "@testing-library/react"
import { expect, it } from "vitest"

import { useProductVisibility } from "@/hooks/useProductVisibility"
import type { ProductId } from "@/content"
import type { AllowedEvent } from "@/lib/analytics"

function VisibilityFixture({
  productId,
  record,
}: {
  productId: ProductId | null
  record: (event: AllowedEvent) => void
}) {
  useProductVisibility(productId, record)
  return null
}

it("reports the active product whenever visibility changes", () => {
  const events: AllowedEvent[] = []
  const record = (event: AllowedEvent) => events.push(event)
  const view = render(
    <VisibilityFixture productId="cryptovault" record={record} />,
  )

  view.rerender(<VisibilityFixture productId="bullledger" record={record} />)
  view.rerender(<VisibilityFixture productId="bullledger" record={record} />)

  expect(events).toEqual([
    { name: "product_view", productId: "cryptovault" },
    { name: "product_view", productId: "bullledger" },
  ])
})

it("waits to report until a product is actually visible", () => {
  const events: AllowedEvent[] = []
  const record = (event: AllowedEvent) => events.push(event)
  const view = render(<VisibilityFixture productId={null} record={record} />)

  expect(events).toEqual([])
  view.rerender(<VisibilityFixture productId="safenumber" record={record} />)
  expect(events).toEqual([{ name: "product_view", productId: "safenumber" }])
})
