import { afterAll, beforeAll } from "vitest"

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }) as MediaQueryList,
  })
}

if (typeof window !== "undefined") {
  const { ScrollTrigger } = await import("@/lib/gsap")

  beforeAll(() => ScrollTrigger.enable())
  afterAll(() => ScrollTrigger.disable(true, true))
}
