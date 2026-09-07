import { ProductMedia } from "@/components/media/ProductMedia"
import type { LandingContentDraft } from "@/content"

type ProductContent = LandingContentDraft["products"]["items"][number]

type ProductEvidenceProps = {
  product: ProductContent
  caption?: string
  comingSoonLabel: string
  eager?: boolean
}

const mediaTypeByExtension: Record<string, string> = {
  avif: "image/avif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  mp4: "video/mp4",
  png: "image/png",
  webm: "video/webm",
  webp: "image/webp",
}

function getMediaType(source: string) {
  const extension = source.split(/[?#]/, 1)[0]?.split(".").at(-1)?.toLowerCase()

  return (extension && mediaTypeByExtension[extension]) || "image/webp"
}

export function ProductEvidence({
  product,
  caption,
  comingSoonLabel,
  eager = false,
}: ProductEvidenceProps) {
  if (product.media.approval === "approved") {
    const { mobileWidth, mobileHeight } = product.media
    const mobileAspect =
      mobileWidth && mobileHeight
        ? { width: mobileWidth, height: mobileHeight }
        : undefined

    return (
      <ProductMedia
        eager={eager}
        mobileAspect={mobileAspect}
        sources={[
          {
            src: product.media.mobileSrc,
            type: getMediaType(product.media.mobileSrc),
            media: "(max-width: 35rem)",
            width: mobileWidth ?? product.media.width,
            height: mobileHeight ?? product.media.height,
          },
          {
            src: product.media.desktopSrc,
            type: getMediaType(product.media.desktopSrc),
            width: product.media.width,
            height: product.media.height,
          },
        ]}
        poster={{
          src: product.media.posterSrc,
          width: product.media.width,
          height: product.media.height,
        }}
        alt={product.media.alt}
        caption={caption}
      />
    )
  }

  const icon = product.icon?.approval === "approved" ? product.icon : undefined

  return (
    <figure
      className="product-evidence product-evidence--coming-soon"
      data-product={product.id}
    >
      {icon ? (
        <img
          className="product-evidence__mark"
          src={icon.src}
          width={icon.width}
          height={icon.height}
          alt={icon.alt}
          loading="lazy"
        />
      ) : null}
      <figcaption className="product-evidence__identity">
        <strong>{product.name}</strong>
        <span>{comingSoonLabel}</span>
      </figcaption>
    </figure>
  )
}

export type { ProductEvidenceProps }
