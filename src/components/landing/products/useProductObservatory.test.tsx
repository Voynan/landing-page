// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { useProductObservatory } from "@/components/landing/products/useProductObservatory"
import type { ProductId } from "@/content"

const productIds = [
  "cryptovault",
  "bullledger",
  "safenumber",
  "constrully",
] as const

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it("changes only when a candidate clearly dominates the current segment", () => {
  let notify: IntersectionObserverCallback = () => undefined
  const observe = vi.fn()
  const disconnect = vi.fn()

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback
      }
      observe = observe
      disconnect = disconnect
    },
  )

  const changes: ProductId[] = []
  function Fixture() {
    const state = useProductObservatory({
      productIds,
      onActiveProductChange: (id) => changes.push(id),
    })

    return (
      <>
        {productIds.map((id) => (
          <div key={id} data-product={id} ref={state.segmentRef(id)} />
        ))}
        <output>{state.activeProductId}</output>
      </>
    )
  }

  const view = render(<Fixture />)
  const nodes = Array.from(view.container.querySelectorAll("[data-product]"))
  const entry = (target: Element, ratio: number) =>
    ({
      target,
      intersectionRatio: ratio,
      isIntersecting: ratio > 0,
    }) as IntersectionObserverEntry

  expect(observe).toHaveBeenCalledTimes(4)

  act(() => {
    notify(
      [entry(nodes[0], 0.2), entry(nodes[1], 0.24)],
      {} as IntersectionObserver,
    )
  })
  expect(screen.getByText("cryptovault")).toBeVisible()

  act(() => {
    notify(
      [entry(nodes[0], 0.08), entry(nodes[1], 0.2)],
      {} as IntersectionObserver,
    )
  })
  expect(screen.getByText("bullledger")).toBeVisible()
  expect(changes).toEqual(["bullledger"])

  view.unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
