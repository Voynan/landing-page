import { ProductMedia } from "@/components/media/ProductMedia"
import type { LandingContentDraft } from "@/content"

type ProductContent = LandingContentDraft["products"]["items"][number]

type ProductEvidenceProps = {
  product: ProductContent
  conceptualLabel: string
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
  conceptualLabel,
  eager = false,
}: ProductEvidenceProps) {
  if (product.media.approval === "approved") {
    return (
      <ProductMedia
        eager={eager}
        sources={[
          {
            src: product.media.mobileSrc,
            type: getMediaType(product.media.mobileSrc),
            media: "(max-width: 35rem)",
            width: product.media.width,
            height: product.media.height,
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
      />
    )
  }

  const accessibleName = `${conceptualLabel}: ${product.name}`

  return (
    <figure
      className="product-evidence product-evidence--conceptual"
      data-product={product.id}
      aria-label={accessibleName}
    >
      <figcaption>
        <span>{conceptualLabel}</span>
        <strong>{product.name}</strong>
      </figcaption>
      <ol className="product-evidence__flow">
        {product.capabilities.map((capability, index) => (
          <li className="product-evidence__node" key={capability}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <strong>{capability}</strong>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export type { ProductEvidenceProps }
