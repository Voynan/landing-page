import { ProductMedia } from "@/components/media/ProductMedia"
import type { LandingContentDraft, ProductId } from "@/content"
import type { AnalyticsTrack } from "@/lib/analytics"

type ProductContent = LandingContentDraft["products"]["items"][number]

const productNames: Record<ProductId, string> = {
  cryptovault: "CryptoVault",
  investfusion: "InvestFusion",
  constrully: "Constrully",
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

type ProductChapterLabels = {
  destinationPending: string
  mediaPending: string
}

type ProductChapterProps = {
  active: boolean
  articleRef?: (node: HTMLElement | null) => void
  labels: ProductChapterLabels
  onActivate: (productId: ProductId) => void
  product: ProductContent
  trackEvent: AnalyticsTrack
}

export function ProductChapter({
  active,
  articleRef,
  labels,
  onActivate,
  product,
  trackEvent,
}: ProductChapterProps) {
  const headingId = `product-${product.id}-title`
  const productName = productNames[product.id]

  return (
    <article
      id={`product-${product.id}`}
      ref={articleRef}
      className="product-chapter"
      data-active={active}
      data-product={product.id}
      aria-labelledby={headingId}
      onFocusCapture={() => onActivate(product.id)}
      onPointerEnter={() => onActivate(product.id)}
    >
      <div className="product-chapter__copy">
        <div className="product-chapter__identity" aria-hidden="true">
          <span>{product.kicker}</span>
          <strong>{productName}</strong>
        </div>

        <h2 id={headingId}>{product.title}</h2>
        <p className="product-chapter__support">{product.support}</p>

        <ul className="product-chapter__capabilities">
          {product.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>

        {product.destination.approval === "approved" ? (
          <a
            className="product-chapter__destination"
            href={product.destination.href}
            onClick={() =>
              trackEvent({ name: "product_click", productId: product.id })
            }
          >
            {product.destination.label}
          </a>
        ) : (
          <span
            className="product-chapter__destination product-chapter__destination--pending"
            role="link"
            aria-disabled="true"
          >
            <span>{product.destination.label}</span>
            <small>{labels.destinationPending}</small>
          </span>
        )}
      </div>

      <div
        className="product-chapter__media"
        data-media-approval={product.media.approval}
      >
        {product.media.approval === "approved" ? (
          <ProductMedia
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
        ) : (
          <figure className="product-media-pending">
            <div className="product-media-pending__stage" aria-hidden="true">
              <span>{productName}</span>
              <i />
            </div>
            <figcaption>
              <strong>{productName}</strong>
              <span>{labels.mediaPending}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </article>
  )
}

export type { ProductChapterLabels, ProductChapterProps }
