// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ProductMedia } from "@/components/media/ProductMedia"

const fixture = {
  sources: [
    {
      src: "/media/product-mobile.webm",
      type: "video/webm",
      media: "(max-width: 560px)",
      width: 720,
      height: 900,
    },
    {
      src: "/media/product-desktop.webm",
      type: "video/webm",
      width: 1600,
      height: 900,
    },
  ],
  poster: {
    src: "/media/product-poster.webp",
    width: 1600,
    height: 900,
  },
  alt: "Product workflow shown in the approved interface",
} as const

afterEach(cleanup)

describe("ProductMedia", () => {
  it("paints the meaningful poster before video is ready", () => {
    render(<ProductMedia {...fixture} eager />)

    const poster = screen.getByRole("img", { name: fixture.alt })
    const video = screen.getByTestId("product-video")

    expect(poster).toBeVisible()
    expect(poster).toHaveAttribute("width", "1600")
    expect(poster).toHaveAttribute("height", "900")
    expect(poster).toHaveAttribute("loading", "eager")
    expect(video).toHaveAttribute("preload", "metadata")
    expect(video).toHaveProperty("muted", true)
    expect(video).toHaveAttribute("playsinline")
    expect(video).toHaveAttribute("autoplay")
  })

  it("keeps the poster when video playback fails", () => {
    const onError = vi.fn()
    render(<ProductMedia {...fixture} onError={onError} />)

    fireEvent.error(screen.getByTestId("product-video"))

    expect(screen.getByRole("img", { name: fixture.alt })).toBeVisible()
    expect(screen.queryByTestId("product-video")).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledOnce()
  })

  it("reveals video only after it can render a meaningful frame", () => {
    const onReady = vi.fn()
    render(<ProductMedia {...fixture} eager onReady={onReady} />)

    const video = screen.getByTestId("product-video")
    expect(screen.getByTestId("product-media")).toHaveAttribute(
      "data-media-state",
      "loading",
    )

    fireEvent.canPlay(video)

    expect(screen.getByTestId("product-media")).toHaveAttribute(
      "data-media-state",
      "ready",
    )
    expect(onReady).toHaveBeenCalledOnce()
  })

  it("does not autoplay or attach video sources under reduced data", () => {
    render(<ProductMedia {...fixture} eager={false} reducedData />)

    const video = screen.getByTestId("product-video")

    expect(video).not.toHaveAttribute("autoplay")
    expect(video).toHaveAttribute("preload", "none")
    expect(video.querySelectorAll("source")).toHaveLength(0)
    expect(screen.getByRole("img", { name: fixture.alt })).toBeVisible()
  })

  it("keeps below-fold playback dormant until a consumer promotes it", () => {
    render(<ProductMedia {...fixture} eager={false} />)

    const video = screen.getByTestId("product-video")

    expect(video).not.toHaveAttribute("autoplay")
    expect(video).toHaveAttribute("preload", "none")
    expect(video.querySelectorAll("source")).toHaveLength(2)
  })

  it("supports art-directed responsive images with explicit dimensions", () => {
    render(
      <ProductMedia
        {...fixture}
        sources={[
          {
            src: "/media/product-mobile.svg",
            type: "image/svg+xml",
            media: "(max-width: 560px)",
            width: 720,
            height: 900,
          },
          {
            src: "/media/product-desktop.svg",
            type: "image/svg+xml",
            width: 1600,
            height: 900,
          },
        ]}
      />,
    )

    const responsiveImage = screen.getByTestId("responsive-image")
    const picture = responsiveImage.closest("picture")

    expect(picture?.querySelector("source")).toHaveAttribute(
      "srcset",
      "/media/product-mobile.svg",
    )
    expect(responsiveImage).toHaveAttribute("width", "1600")
    expect(responsiveImage).toHaveAttribute("height", "900")

    fireEvent.load(responsiveImage)

    expect(screen.getByTestId("product-media")).toHaveAttribute(
      "data-media-state",
      "ready",
    )
  })
  it("reserves the poster proportion for the layout box", () => {
    render(<ProductMedia {...fixture} />)

    const media = screen.getByTestId("product-media")

    expect(media.style.getPropertyValue("--product-media-ratio")).toBe(
      "1600 / 900",
    )
    expect(media.style.getPropertyValue("--product-media-ratio-mobile")).toBe(
      "",
    )
  })

  it("reserves a separate proportion when the mobile crop is shaped differently", () => {
    render(
      <ProductMedia
        {...fixture}
        mobileAspect={{ width: 1040, height: 1300 }}
      />,
    )

    const media = screen.getByTestId("product-media")

    expect(media.style.getPropertyValue("--product-media-ratio")).toBe(
      "1600 / 900",
    )
    expect(media.style.getPropertyValue("--product-media-ratio-mobile")).toBe(
      "1040 / 1300",
    )
  })

  it("labels the media with a visible caption when one is supplied", () => {
    render(<ProductMedia {...fixture} caption="Product home page" />)

    // The caption is the figure's own label, so it stays inside the figure.
    const figure = screen.getByRole("figure")

    expect(within(figure).getByTestId("product-media")).toBeVisible()
    expect(within(figure).getByText("Product home page")).toBeVisible()
  })

  it("stays a bare media box when no caption is supplied", () => {
    render(<ProductMedia {...fixture} />)

    expect(screen.queryByRole("figure")).not.toBeInTheDocument()
    expect(screen.getByTestId("product-media")).toBeVisible()
  })
})
