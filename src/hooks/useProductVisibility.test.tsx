// @vitest-environment jsdom

import { render } from "@testing-library/react"
import { expect, it } from "vitest"

import { useProductVisibility } from "@/hooks/useProductVisibility"
import type { AllowedEvent } from "@/lib/analytics"

function VisibilityFixture({
  productId,
  record,
}: {
  productId: "cryptovault" | "investfusion" | "constrully"
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

  view.rerender(<VisibilityFixture productId="investfusion" record={record} />)
  view.rerender(<VisibilityFixture productId="investfusion" record={record} />)

  expect(events).toEqual([
    { name: "product_view", productId: "cryptovault" },
    { name: "product_view", productId: "investfusion" },
  ])
})
