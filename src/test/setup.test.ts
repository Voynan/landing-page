// @vitest-environment jsdom

import { expect, it, vi } from "vitest"

import { ScrollTrigger } from "@/lib/gsap"

it("stops every ScrollTrigger timer when the suite tears ScrollTrigger down", async () => {
  // The same teardown the shared setup runs after each jsdom test file. A
  // timer that survives it fires after jsdom is gone and crashes the run.
  ScrollTrigger.disable(true, true)
  const frames = vi.spyOn(globalThis, "requestAnimationFrame")

  await new Promise((resolve) => setTimeout(resolve, 600))

  expect(
    frames.mock.calls.filter(([callback]) => callback.name === "_updateAll"),
  ).toEqual([])
})
