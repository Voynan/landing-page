// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import "@/styles/globals.css"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LiveRegion } from "@/components/ui/LiveRegion"
import { SkipLink } from "@/components/ui/SkipLink"

afterEach(cleanup)

describe("accessible UI primitives", () => {
  it("exposes a skip link targeting the primary content", () => {
    render(
      <>
        <SkipLink targetId="main-content" />
        <Button>Contato</Button>
      </>,
    )

    expect(
      screen.getByRole("link", { name: /pular para o conteúdo/i }),
    ).toHaveAttribute("href", "#main-content")
    expect(screen.getByRole("button", { name: "Contato" })).toBeEnabled()
  })

  it("keeps keyboard focus visible as navigation reaches the primary action", async () => {
    const user = userEvent.setup()

    render(
      <>
        <SkipLink targetId="main-content" />
        <Button>Contato</Button>
      </>,
    )

    await user.tab()
    expect(
      screen.getByRole("link", { name: /pular para o conteúdo/i }),
    ).toHaveFocus()

    await user.tab()
    const button = screen.getByRole("button", { name: "Contato" })

    expect(button).toHaveFocus()
    expect(button).not.toHaveClass("outline-none")
    expect(button).toHaveClass("focus-visible:outline-ring")
  })

  it("announces status messages with configurable politeness", () => {
    const { rerender } = render(<LiveRegion message="Mensagem enviada" />)

    expect(screen.getByText("Mensagem enviada")).toHaveAttribute(
      "aria-live",
      "polite",
    )
    expect(screen.getByText("Mensagem enviada")).toHaveAttribute(
      "role",
      "status",
    )

    rerender(<LiveRegion message="Falha ao enviar" politeness="assertive" />)

    expect(screen.getByText("Falha ao enviar")).toHaveAttribute(
      "aria-live",
      "assertive",
    )
    expect(screen.getByText("Falha ao enviar")).toHaveAttribute("role", "alert")
  })

  it("keeps labels associated with their controls", () => {
    render(
      <>
        <Label htmlFor="email">E-mail</Label>
        <input id="email" type="email" />
      </>,
    )

    expect(screen.getByRole("textbox", { name: "E-mail" })).toHaveAttribute(
      "type",
      "email",
    )
  })
})
