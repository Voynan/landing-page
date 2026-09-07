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

// jsdom exposes no localStorage under this runtime, so tests that exercise
// stored preferences get an in-memory implementation with the same contract.
if (typeof window !== "undefined" && !window.localStorage) {
  const values = new Map<string, string>()

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return values.size
      },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    } satisfies Storage,
  })
}

if (typeof window !== "undefined") {
  const { ScrollTrigger } = await import("@/lib/gsap")

  beforeAll(() => ScrollTrigger.enable())
  afterAll(() => ScrollTrigger.disable(true, true))
}
