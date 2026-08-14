import { useEffect, useRef } from "react"

import voyNanWordmark from "@/assets/brand/voynan-wordmark.svg"
import { ProductMedia } from "@/components/media/ProductMedia"
import type { MediaSource } from "@/components/media/ResponsiveMedia"

const poster = {
  src: voyNanWordmark,
  width: 300,
  height: 120,
} as const

const responsiveSources = [
  {
    src: voyNanWordmark,
    type: "image/svg+xml",
    media: "(max-width: 560px)",
    width: 300,
    height: 120,
  },
  {
    src: voyNanWordmark,
    type: "image/svg+xml",
    width: 300,
    height: 120,
  },
] satisfies readonly MediaSource[]

type MediaFixtureProps = {
  title: string
  description: string
  sources: readonly MediaSource[]
  event?: "load" | "error"
  reducedData?: boolean
  freezeLoading?: boolean
}

const mediaStates = [
  {
    title: "Poster",
    description: "The meaningful static frame paints before enhancement.",
    sources: [] as const,
  },
  {
    title: "Loading",
    description: "The poster holds the frame while media remains pending.",
    sources: responsiveSources,
    freezeLoading: true,
  },
  {
    title: "Ready",
    description: "Media replaces the poster only after a usable frame exists.",
    sources: responsiveSources,
    event: "load",
  },
  {
    title: "Error",
    description: "Playback disappears silently; the poster and copy remain.",
    sources: responsiveSources,
    event: "error",
  },
  {
    title: "Reduced data",
    description: "Nonessential sources stay detached from the document.",
    sources: responsiveSources,
    reducedData: true,
  },
] as const satisfies readonly MediaFixtureProps[]

function MediaFixture({
  title,
  description,
  sources,
  event,
  reducedData,
  freezeLoading,
}: MediaFixtureProps) {
  const fixtureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!event) {
      return
    }

    fixtureRef.current
      ?.querySelector('[data-testid="responsive-image"]')
      ?.dispatchEvent(new Event(event))
  }, [event])

  return (
    <article className="ds-media-state">
      <div
        ref={fixtureRef}
        className="ds-media-fixture"
        data-demo-state={freezeLoading ? "loading" : undefined}
      >
        <ProductMedia
          sources={sources}
          poster={poster}
          alt="Voynan media resilience calibration frame"
          reducedData={reducedData}
        />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export function MediaSpecimen() {
  return (
    <section id="media" className="ds-specimen" aria-labelledby="media-heading">
      <header className="ds-specimen__header">
        <h2 id="media-heading">Media</h2>
        <p>
          Poster-first production behavior under real loading, ready, failure,
          and reduced-data conditions. The neutral Voynan fixture makes no
          product claim.
        </p>
      </header>

      <div className="ds-media-bench">
        {mediaStates.map((state) => (
          <MediaFixture key={state.title} {...state} />
        ))}
      </div>
    </section>
  )
}
