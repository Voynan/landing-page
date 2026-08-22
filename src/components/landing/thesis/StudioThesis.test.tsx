// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import { StudioThesis } from "@/components/landing/thesis/StudioThesis"
import { getLandingContent } from "@/content"

afterEach(cleanup)

it("keeps the complete studio thesis readable in the static document", () => {
  const content = getLandingContent("en").thesis

  render(<StudioThesis content={content} />)

  expect(screen.getByText(content.statement)).toBeVisible()
})
