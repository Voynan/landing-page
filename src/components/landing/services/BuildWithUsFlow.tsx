import { useRef, type RefObject } from "react"

import { CapabilityLayer } from "@/components/landing/services/CapabilityLayer"
import { PearlescentStarfield } from "@/components/motion/PearlescentStarfield"
import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { Button } from "@/components/ui/button"
import type { LandingContentDraft } from "@/content"
import { gsap } from "@/lib/gsap"

type BuildWithUsFlowLabels = {
  sectionLabel: string
  destinationPending: string
}

type BuildWithUsFlowProps = {
  content: LandingContentDraft["services"]
  labels: BuildWithUsFlowLabels
}

function useServicesMotion(scope: RefObject<HTMLElement | null>) {
  useChapterMotion(scope, ({ profile, root, select }) => {
    const layers = select(".capability-layer")
    const nodes = select(".capability-layer__node")
    const signals = select(".capability-layer__signal")
    const connectorFills = select(".capability-layer__connector-fill")
    const isHorizontal = profile === "desktop"

    if (layers.length === 0 || nodes.length === 0 || signals.length === 0)
      return

    gsap.set(layers, { attr: { "data-active": "false" } })
    gsap.set(signals, {
      scale: 0,
      transformOrigin: "center",
    })
    gsap.set(connectorFills, {
      scaleX: isHorizontal ? 0 : 1,
      scaleY: isHorizontal ? 1 : 0,
      transformOrigin: isHorizontal ? "left center" : "center top",
    })

    const timeline = gsap.timeline({
      id: "services-flow-loop",
      paused: true,
      repeat: -1,
      repeatDelay: 0.45,
    })

    nodes.forEach((node, index) => {
      const stageLabel = `stage-${index}`
      const signal = signals[index]

      timeline
        .addLabel(stageLabel)
        .set(layers[index], { attr: { "data-active": "true" } }, stageLabel)

      if (index === 0) {
        timeline.to(
          connectorFills[0],
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.28,
            ease: "power2.out",
          },
          stageLabel,
        )
      }

      timeline
        .to(
          signal,
          {
            scale: 1,
            duration: 0.26,
            ease: "power3.out",
          },
          stageLabel,
        )
        .to(
          node,
          {
            scale: 1.18,
            duration: 0.18,
            ease: "power3.out",
          },
          stageLabel,
        )
        .to(node, {
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
        })

      const outgoingFill = connectorFills[index + 1]
      if (outgoingFill) {
        timeline.to(
          outgoingFill,
          {
            scaleX: 1,
            scaleY: 1,
            duration: index === nodes.length - 1 ? 0.42 : 0.68,
            ease: "none",
          },
          "+=0.2",
        )
      } else {
        timeline.to({}, { duration: 0.54 })
      }
    })

    timeline
      .addLabel("journey-complete")
      .to({}, { duration: 0.78 })
      .addLabel("journey-reset")
      .set(layers, { attr: { "data-active": "false" } }, "journey-reset")
      .to(
        signals,
        {
          scale: 0,
          duration: 0.32,
          ease: "power2.inOut",
        },
        "journey-reset",
      )
      .to(
        connectorFills,
        {
          scaleX: isHorizontal ? 0 : 1,
          scaleY: isHorizontal ? 1 : 0,
          duration: 0.32,
          ease: "power2.inOut",
        },
        "journey-reset",
      )

    let isVisible = false
    const syncPlayback = () => {
      if (isVisible && !document.hidden) {
        timeline.play()
      } else {
        timeline.pause()
      }
    }

    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? false
              syncPlayback()
            },
            { rootMargin: "8% 0px" },
          )

    observer?.observe(root)
    document.addEventListener("visibilitychange", syncPlayback)
    syncPlayback()

    return () => {
      observer?.disconnect()
      document.removeEventListener("visibilitychange", syncPlayback)
      timeline.kill()
    }
  })
}

export function BuildWithUsFlow({ content, labels }: BuildWithUsFlowProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useServicesMotion(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={content.id}
      className="services-flow landing-chapter"
      aria-labelledby="services-title"
    >
      <PearlescentStarfield motionId="services-starfield-drift" variant={3} />

      <div className="landing-chapter__frame">
        <header className="services-flow__header">
          <p className="services-flow__intent">{content.kicker}</p>
          <div className="services-flow__introduction">
            <h2 id="services-title">{content.title}</h2>
            <p>{content.support}</p>
          </div>
        </header>

        <ol className="services-flow__layers" aria-label={labels.sectionLabel}>
          {content.layers.map((layer, index) => (
            <CapabilityLayer
              key={layer.title}
              capabilities={layer.capabilities}
              index={index}
              isLast={index === content.layers.length - 1}
              title={layer.title}
            />
          ))}
        </ol>

        <footer className="services-flow__footer">
          <Button asChild size="lg">
            <a
              className="services-flow__cta"
              href={`#${content.cta.sectionId}`}
            >
              {content.cta.label}
            </a>
          </Button>
        </footer>
      </div>
    </section>
  )
}

export type { BuildWithUsFlowLabels, BuildWithUsFlowProps }
