type MotionConditions = {
  isDesktop: boolean
  isMobile: boolean
  isTablet: boolean
  reduceMotion: boolean
}

type MotionProfile = "desktop" | "tablet" | "mobile" | "reduced" | "static"

const motionQueries = {
  isDesktop: "(min-width: 61.3125rem)",
  isTablet: "(min-width: 35.0625rem) and (max-width: 61.25rem)",
  isMobile: "(max-width: 35rem)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const

function resolveMotionProfile({
  isDesktop,
  isMobile,
  isTablet,
  reduceMotion,
}: MotionConditions): MotionProfile {
  if (reduceMotion) return "reduced"
  if (isDesktop) return "desktop"
  if (isTablet) return "tablet"
  if (isMobile) return "mobile"
  return "static"
}

export { motionQueries, resolveMotionProfile }
export type { MotionConditions, MotionProfile }
