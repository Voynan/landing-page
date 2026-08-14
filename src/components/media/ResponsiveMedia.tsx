export type MediaSource = {
  src: string
  type: string
  media?: string
  width: number
  height: number
}

type ResponsiveMediaProps = {
  sources: readonly MediaSource[]
  kind: "image" | "video"
  autoPlay: boolean
  preload: "none" | "metadata"
  onReady: () => void
  onError: () => void
}

export function ResponsiveMedia({
  sources,
  kind,
  autoPlay,
  preload,
  onReady,
  onError,
}: ResponsiveMediaProps) {
  const fallbackSource = sources.at(-1)

  if (kind === "image" && fallbackSource) {
    return (
      <picture className="product-media__responsive" aria-hidden="true">
        {sources.slice(0, -1).map((source) => (
          <source
            key={`${source.src}-${source.media ?? "default"}`}
            srcSet={source.src}
            type={source.type}
            media={source.media}
          />
        ))}
        <img
          data-testid="responsive-image"
          className="product-media__asset"
          src={fallbackSource.src}
          width={fallbackSource.width}
          height={fallbackSource.height}
          alt=""
          loading="lazy"
          onLoad={onReady}
          onError={onError}
        />
      </picture>
    )
  }

  const dimensions = fallbackSource ?? sources[0]

  return (
    <video
      data-testid="product-video"
      className="product-media__responsive product-media__asset"
      width={dimensions?.width}
      height={dimensions?.height}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={onReady}
      onError={onError}
    >
      {sources.map((source) => (
        <source
          key={`${source.src}-${source.media ?? "default"}`}
          src={source.src}
          type={source.type}
          media={source.media}
        />
      ))}
    </video>
  )
}
