import { describe, expect, it } from "vitest"

import { resolveMotionProfile } from "@/components/motion/motionQueries"

describe("resolveMotionProfile", () => {
  it("gives reduced motion priority over viewport choreography", () => {
    expect(
      resolveMotionProfile({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
        reduceMotion: true,
      }),
    ).toBe("reduced")
  })

  it.each([
    ["desktop", true, false, false],
    ["tablet", false, true, false],
    ["mobile", false, false, true],
  ] as const)(
    "selects the %s choreography without overlapping another viewport",
    (expected, isDesktop, isTablet, isMobile) => {
      expect(
        resolveMotionProfile({
          isDesktop,
          isMobile,
          isTablet,
          reduceMotion: false,
        }),
      ).toBe(expected)
    },
  )

  it("falls back to static motion when no viewport query matches", () => {
    expect(
      resolveMotionProfile({
        isDesktop: false,
        isMobile: false,
        isTablet: false,
        reduceMotion: false,
      }),
    ).toBe("static")
  })
})
