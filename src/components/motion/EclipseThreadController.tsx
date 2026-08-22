import { useRef, useState } from "react"

import {
  EclipseThread,
  type EclipseState,
} from "@/components/motion/EclipseThread"
import {
  motionQueries,
  resolveMotionProfile,
  type MotionConditions,
  type MotionProfile,
} from "@/components/motion/motionQueries"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

const sectionStates = [
  ["hero", "ring"],
  ["thesis", "line"],
  ["products", "orbit"],
  ["credibility", "evidence"],
  ["services", "flow"],
  ["aegis", "code"],
  ["founder", "signature"],
  ["contact", "closing-ring"],
] as const satisfies readonly (readonly [string, EclipseState])[]

function getTriggerRange(profile: MotionProfile) {
  if (profile === "mobile") {
    return { end: "bottom 48%", start: "top 72%" }
  }

  if (profile === "tablet") {
    return { end: "bottom 42%", start: "top 62%" }
  }

  return { end: "bottom 38%", start: "top 58%" }
}

function observeStaticSections(
  root: HTMLElement,
  onStateChange: (state: EclipseState) => void,
) {
  if (typeof IntersectionObserver === "undefined") return

  const sections = sectionStates.flatMap(([sectionId, sectionState]) => {
    const section = root.querySelector<HTMLElement>(`#${sectionId}`)
    return section ? [{ section, state: sectionState }] : []
  })
  const ratios = new Map(sections.map(({ section }) => [section, 0]))
  const states = new Map(
    sections.map(({ section, state }) => [section, state] as const),
  )
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target as HTMLElement
        if (!ratios.has(section)) return

        ratios.set(section, entry.isIntersecting ? entry.intersectionRatio : 0)
      })

      let nextState: EclipseState | undefined
      let highestRatio = 0

      sections.forEach(({ section }) => {
        const ratio = ratios.get(section) ?? 0
        if (ratio <= highestRatio) return

        highestRatio = ratio
        nextState = states.get(section)
      })

      if (nextState) onStateChange(nextState)
    },
    { rootMargin: "-42% 0px -42%", threshold: [0, 0.05, 0.2, 0.5, 0.8] },
  )

  sections.forEach(({ section }) => observer.observe(section))
  return () => observer.disconnect()
}

export function EclipseThreadController() {
  const controllerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<EclipseState>("ring")
  const [profile, setProfile] = useState<MotionProfile>("static")

  useGSAP(
    () => {
      const thread = controllerRef.current
      const root = thread?.parentElement
      if (!root || !thread) return

      const matchMedia = gsap.matchMedia()

      matchMedia.add(
        motionQueries,
        (context) => {
          const nextProfile = resolveMotionProfile(
            context.conditions as MotionConditions,
          )
          setProfile(nextProfile)

          if (nextProfile === "static") {
            setState("ring")
            return
          }

          if (nextProfile === "reduced") {
            setState("ring")
            return observeStaticSections(root, setState)
          }

          const { end, start } = getTriggerRange(nextProfile)

          sectionStates.forEach(([sectionId, sectionState]) => {
            const section = root.querySelector<HTMLElement>(`#${sectionId}`)
            if (!section) return

            ScrollTrigger.create({
              id: `eclipse-${sectionId}`,
              trigger: section,
              start,
              end,
              onEnter: () => setState(sectionState),
              onEnterBack: () => setState(sectionState),
            })
          })
        },
        root,
      )

      return () => matchMedia.revert()
    },
    { scope: controllerRef },
  )

  useGSAP(
    () => {
      const thread = controllerRef.current
      if (!thread) return

      const activeLayer = thread.querySelector<SVGGElement>(
        `[data-eclipse-layer="${state}"]`,
      )
      const inactiveLayers = thread.querySelectorAll<SVGGElement>(
        `[data-eclipse-layer]:not([data-eclipse-layer="${state}"])`,
      )

      gsap.set(inactiveLayers, { autoAlpha: 0 })
      if (!activeLayer) return

      if (profile === "reduced" || profile === "static") {
        gsap.set(activeLayer, { autoAlpha: 1, rotation: 0, scale: 1 })
        return
      }

      gsap.fromTo(
        activeLayer,
        { autoAlpha: 0, scale: 0.92 },
        {
          autoAlpha: 1,
          scale: 1,
          duration:
            profile === "desktop" ? 0.76 : profile === "tablet" ? 0.48 : 0.28,
          ease: "expo.out",
          overwrite: "auto",
        },
      )
    },
    {
      dependencies: [profile, state],
      revertOnUpdate: true,
      scope: controllerRef,
    },
  )

  return (
    <div
      ref={controllerRef}
      className="eclipse-thread-controller"
      data-motion-profile={profile}
      data-state={state}
      data-testid="eclipse-thread-controller"
    >
      <EclipseThread
        className="eclipse-thread-controller__graphic"
        reducedMotion={profile === "reduced" || profile === "static"}
        state={state}
      />
    </div>
  )
}
