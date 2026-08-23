import { useRef, type CSSProperties } from "react"

import { useChapterMotion } from "@/components/motion/useChapterMotion"
import { gsap } from "@/lib/gsap"

type StarSize = "large" | "medium" | "small"
type StarTone = "copper" | "pearl"

type StarParticle = {
  driftX: number
  driftY: number
  duration: number
  opacity: number
  size: StarSize
  tone: StarTone
  x: number
  y: number
}

type PearlescentStarfieldProps = {
  motionId: string
  variant?: number
}

const starParticles = [
  {
    x: 2,
    y: 18,
    size: "small",
    tone: "pearl",
    driftX: 3,
    driftY: -4,
    duration: 5.2,
    opacity: 0.58,
  },
  {
    x: 7,
    y: 69,
    size: "medium",
    tone: "copper",
    driftX: -4,
    driftY: 3,
    duration: 6.4,
    opacity: 0.72,
  },
  {
    x: 11,
    y: 36,
    size: "small",
    tone: "pearl",
    driftX: 2,
    driftY: 4,
    duration: 4.6,
    opacity: 0.48,
  },
  {
    x: 16,
    y: 86,
    size: "small",
    tone: "copper",
    driftX: 4,
    driftY: -2,
    duration: 5.8,
    opacity: 0.66,
  },
  {
    x: 20,
    y: 14,
    size: "large",
    tone: "copper",
    driftX: -3,
    driftY: 3,
    duration: 6.8,
    opacity: 0.86,
  },
  {
    x: 25,
    y: 58,
    size: "small",
    tone: "pearl",
    driftX: 5,
    driftY: 2,
    duration: 4.2,
    opacity: 0.54,
  },
  {
    x: 29,
    y: 30,
    size: "medium",
    tone: "pearl",
    driftX: -2,
    driftY: -4,
    duration: 5.6,
    opacity: 0.7,
  },
  {
    x: 34,
    y: 77,
    size: "small",
    tone: "copper",
    driftX: 3,
    driftY: 5,
    duration: 6.1,
    opacity: 0.46,
  },
  {
    x: 38,
    y: 48,
    size: "small",
    tone: "copper",
    driftX: -4,
    driftY: 2,
    duration: 4.8,
    opacity: 0.64,
  },
  {
    x: 43,
    y: 20,
    size: "small",
    tone: "pearl",
    driftX: 2,
    driftY: -3,
    duration: 5.4,
    opacity: 0.52,
  },
  {
    x: 47,
    y: 90,
    size: "medium",
    tone: "copper",
    driftX: 4,
    driftY: -4,
    duration: 6.6,
    opacity: 0.7,
  },
  {
    x: 51,
    y: 61,
    size: "small",
    tone: "pearl",
    driftX: -3,
    driftY: 2,
    duration: 4.4,
    opacity: 0.5,
  },
  {
    x: 56,
    y: 34,
    size: "large",
    tone: "pearl",
    driftX: 3,
    driftY: 4,
    duration: 6.2,
    opacity: 0.88,
  },
  {
    x: 60,
    y: 8,
    size: "small",
    tone: "copper",
    driftX: -5,
    driftY: 2,
    duration: 5.1,
    opacity: 0.44,
  },
  {
    x: 64,
    y: 82,
    size: "small",
    tone: "pearl",
    driftX: 2,
    driftY: -5,
    duration: 5.9,
    opacity: 0.58,
  },
  {
    x: 68,
    y: 54,
    size: "medium",
    tone: "copper",
    driftX: -3,
    driftY: 3,
    duration: 6.7,
    opacity: 0.72,
  },
  {
    x: 72,
    y: 25,
    size: "small",
    tone: "pearl",
    driftX: 4,
    driftY: -2,
    duration: 4.7,
    opacity: 0.5,
  },
  {
    x: 76,
    y: 72,
    size: "small",
    tone: "copper",
    driftX: -2,
    driftY: 4,
    duration: 5.5,
    opacity: 0.56,
  },
  {
    x: 80,
    y: 43,
    size: "large",
    tone: "pearl",
    driftX: 5,
    driftY: 3,
    duration: 6.5,
    opacity: 0.9,
  },
  {
    x: 84,
    y: 12,
    size: "small",
    tone: "pearl",
    driftX: -4,
    driftY: -3,
    duration: 5,
    opacity: 0.48,
  },
  {
    x: 88,
    y: 88,
    size: "medium",
    tone: "pearl",
    driftX: 3,
    driftY: -4,
    duration: 6,
    opacity: 0.68,
  },
  {
    x: 92,
    y: 60,
    size: "small",
    tone: "copper",
    driftX: -5,
    driftY: 2,
    duration: 4.5,
    opacity: 0.62,
  },
  {
    x: 96,
    y: 31,
    size: "medium",
    tone: "copper",
    driftX: 2,
    driftY: 5,
    duration: 5.7,
    opacity: 0.74,
  },
  {
    x: 98,
    y: 78,
    size: "small",
    tone: "pearl",
    driftX: -3,
    driftY: -2,
    duration: 6.3,
    opacity: 0.52,
  },
] as const satisfies readonly StarParticle[]

function shiftCoordinate(
  coordinate: number,
  variant: number,
  step: number,
  minimum: number,
  span: number,
) {
  if (variant === 0) return coordinate
  return minimum + ((coordinate - minimum + variant * step) % span)
}

export function PearlescentStarfield({
  motionId,
  variant = 0,
}: PearlescentStarfieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const driftDirection = variant % 2 === 0 ? 1 : -1

  useChapterMotion(fieldRef, ({ root, select }) => {
    const particles = select("[data-star]")

    gsap.fromTo(
      particles,
      {
        x: (index) => starParticles[index].driftX * driftDirection * -0.5,
        y: (index) => starParticles[index].driftY * -0.5,
        opacity: (index) => Math.max(0.32, starParticles[index].opacity - 0.18),
      },
      {
        x: (index) => starParticles[index].driftX * driftDirection * 0.5,
        y: (index) => starParticles[index].driftY * 0.5,
        opacity: (index) => starParticles[index].opacity,
        duration: (index) => starParticles[index].duration,
        ease: "sine.inOut",
        repeat: -1,
        stagger: { each: 0.07, from: "random" },
        transformOrigin: "center",
        yoyo: true,
        scrollTrigger: {
          id: motionId,
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      },
    )
  })

  return (
    <div
      ref={fieldRef}
      className="pearlescent-starfield"
      data-variant={variant}
      data-testid="pearlescent-starfield"
      aria-hidden="true"
    >
      {starParticles.map((star, index) => (
        <span
          key={`${star.x}-${star.y}`}
          className="pearlescent-starfield__star"
          data-size={star.size}
          data-star={index}
          data-tone={star.tone}
          style={
            {
              left: `${shiftCoordinate(star.x, variant, 17, 2, 96)}%`,
              opacity: star.opacity,
              top: `${shiftCoordinate(star.y, variant, 19, 8, 84)}%`,
            } satisfies CSSProperties
          }
        />
      ))}
    </div>
  )
}

export type { PearlescentStarfieldProps }
