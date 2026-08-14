import { useRef, useState } from "react"

import {
  ResponsiveMedia,
  type MediaSource,
} from "@/components/media/ResponsiveMedia"
import { useReducedData } from "@/hooks/useReducedData"

export type MediaPoster = {
  src: string
  width: number
  height: number
}

type ProductMediaProps = {
  sources: readonly MediaSource[]
  poster: MediaPoster
  alt: string
  eager?: boolean
  reducedData?: boolean
  onReady?: () => void
  onError?: () => void
  className?: string
}

type MediaState = "poster" | "loading" | "ready" | "error"

export function ProductMedia({
  sources,
  poster,
  alt,
  eager = false,
  reducedData,
  onReady,
  onError,
  className,
}: ProductMediaProps) {
  const prefersReducedData = useReducedData()
  const shouldReduceData = reducedData ?? prefersReducedData
  const mediaKind = sources.every((source) => source.type.startsWith("image/"))
    ? "image"
    : "video"
  const [mediaState, setMediaState] = useState<MediaState>(() =>
    sources.length > 0 && !shouldReduceData ? "loading" : "poster",
  )
  const readyNotified = useRef(false)
  const errorNotified = useRef(false)

  const handleReady = () => {
    setMediaState("ready")

    if (!readyNotified.current) {
      readyNotified.current = true
      onReady?.()
    }
  }

  const handleError = () => {
    setMediaState("error")

    if (!errorNotified.current) {
      errorNotified.current = true
      onError?.()
    }
  }

  const attachedSources = shouldReduceData ? [] : sources
  const shouldRenderResponsiveMedia =
    sources.length > 0 && (mediaKind === "video" || !shouldReduceData)

  return (
    <div
      data-testid="product-media"
      data-media-state={mediaState}
      className={["product-media", className].filter(Boolean).join(" ")}
      style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
    >
      <img
        className="product-media__poster"
        src={poster.src}
        width={poster.width}
        height={poster.height}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
      {shouldRenderResponsiveMedia && mediaState !== "error" ? (
        <ResponsiveMedia
          sources={attachedSources}
          kind={mediaKind}
          autoPlay={eager && !shouldReduceData}
          preload={eager && !shouldReduceData ? "metadata" : "none"}
          onReady={handleReady}
          onError={handleError}
        />
      ) : null}
    </div>
  )
}
