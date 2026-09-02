import type { RefObject } from "react"

import {
  motionQueries,
  resolveMotionProfile,
  type MotionConditions,
  type MotionProfile,
} from "@/components/motion/motionQueries"
import { gsap, useGSAP } from "@/lib/gsap"

type EnhancedMotionProfile = Exclude<MotionProfile, "reduced" | "static">

type ChapterMotionContext<TElement extends Element = HTMLElement> = {
  profile: EnhancedMotionProfile
  root: TElement
  select: ReturnType<typeof gsap.utils.selector>
}

type ChapterMotionCleanup = () => void
type ChapterMotionSetup<TElement extends Element = HTMLElement> = (
  context: ChapterMotionContext<TElement>,
) => ChapterMotionCleanup | void

type ChapterMotionOptions = {
  enabled?: boolean
  onProfileChange?: (profile: MotionProfile) => void
}

function useChapterMotion<TElement extends Element = HTMLElement>(
  scope: RefObject<TElement | null>,
  setup: ChapterMotionSetup<TElement>,
  { enabled = true, onProfileChange }: ChapterMotionOptions = {},
) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      if (!enabled) {
        gsap.set(root, { attr: { "data-motion-profile": "static" } })
        onProfileChange?.("static")
        return
      }

      const matchMedia = gsap.matchMedia()

      matchMedia.add(
        motionQueries,
        (context) => {
          const profile = resolveMotionProfile(
            context.conditions as MotionConditions,
          )
          gsap.set(root, { attr: { "data-motion-profile": profile } })
          onProfileChange?.(profile)

          if (profile === "reduced" || profile === "static") return

          return setup({
            profile,
            root,
            select: gsap.utils.selector(root),
          })
        },
        root,
      )

      return () => {
        matchMedia.revert()
      }
    },
    {
      dependencies: [enabled, onProfileChange],
      revertOnUpdate: true,
      scope,
    },
  )
}

export { useChapterMotion }
export type {
  ChapterMotionContext,
  ChapterMotionCleanup,
  ChapterMotionOptions,
  ChapterMotionSetup,
  EnhancedMotionProfile,
}
