import type { RefObject } from "react"

import {
  motionQueries,
  resolveMotionProfile,
  type MotionConditions,
  type MotionProfile,
} from "@/components/motion/motionQueries"
import { gsap, useGSAP } from "@/lib/gsap"

type EnhancedMotionProfile = Exclude<MotionProfile, "reduced" | "static">

type ChapterMotionContext = {
  profile: EnhancedMotionProfile
  root: HTMLElement
  select: ReturnType<typeof gsap.utils.selector>
}

type ChapterMotionSetup = (context: ChapterMotionContext) => void

type ChapterMotionOptions = {
  enabled?: boolean
  onProfileChange?: (profile: MotionProfile) => void
}

function useChapterMotion(
  scope: RefObject<HTMLElement | null>,
  setup: ChapterMotionSetup,
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

          setup({
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
  ChapterMotionOptions,
  ChapterMotionSetup,
  EnhancedMotionProfile,
}
