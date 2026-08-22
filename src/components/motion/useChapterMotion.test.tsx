// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { useRef } from "react"
import { afterEach, expect, it, vi } from "vitest"

import { motionQueries } from "@/components/motion/motionQueries"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { gsap, ScrollTrigger } from "@/lib/gsap"

function installMatchMedia({ reduced = false } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        query === motionQueries.isDesktop ||
        (query === motionQueries.reduceMotion && reduced),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })),
  )
}

function ChapterHarness({ onEnhance }: { onEnhance: () => void }) {
  const scope = useRef<HTMLElement>(null)

  useChapterMotion(scope, ({ root, select }) => {
    onEnhance()
    gsap.to(select("[data-motion-target]"), {
      x: 12,
      scrollTrigger: { id: "chapter-test", trigger: root },
    })
  })

  return (
    <section ref={scope} data-testid="chapter">
      <span data-motion-target>Visible without motion</span>
    </section>
  )
}

afterEach(() => {
  cleanup()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  vi.unstubAllGlobals()
})

it("runs authored motion in its local scope and reverts it on unmount", async () => {
  installMatchMedia()
  const onEnhance = vi.fn()
  const baseline = ScrollTrigger.getAll().length

  const { unmount } = render(<ChapterHarness onEnhance={onEnhance} />)

  await waitFor(() => {
    expect(screen.getByTestId("chapter")).toHaveAttribute(
      "data-motion-profile",
      "desktop",
    )
    expect(onEnhance).toHaveBeenCalledOnce()
    expect(ScrollTrigger.getAll()).toHaveLength(baseline + 1)
  })

  unmount()
  expect(ScrollTrigger.getAll()).toHaveLength(baseline)
})

it("keeps semantic content visible and skips authored motion when reduced", async () => {
  installMatchMedia({ reduced: true })
  const onEnhance = vi.fn()

  render(<ChapterHarness onEnhance={onEnhance} />)

  await waitFor(() => {
    expect(screen.getByTestId("chapter")).toHaveAttribute(
      "data-motion-profile",
      "reduced",
    )
  })

  expect(onEnhance).not.toHaveBeenCalled()
  expect(screen.getByText("Visible without motion")).toBeVisible()
  expect(ScrollTrigger.getAll()).toHaveLength(0)
})
