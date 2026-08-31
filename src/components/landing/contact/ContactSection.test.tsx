// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"

import { ContactSection } from "@/components/landing/contact/ContactSection"
import type { ContactSectionLabels } from "@/components/landing/contact/ContactSection"
import type { AllowedEvent } from "@/lib/analytics"
import { ContactSubmissionError } from "@/services/contact"

const labels: ContactSectionLabels = {
  sectionLabel: "Contato",
  fields: { name: "Nome", email: "E-mail", message: "Mensagem" },
  validation: {
    required: "Preencha este campo.",
    email: "Informe um e-mail válido.",
    summary: "Revise os campos indicados.",
  },
  status: {
    submitting: "Enviando…",
    success: "Mensagem enviada.",
    failure: "Não foi possível enviar a mensagem.",
    timeout: "O envio demorou demais. Tente novamente ou use o e-mail.",
    unavailable: "Envio aguardando configuração segura.",
  },
  feedback: {
    copyEmail: "Copiar e-mail",
    emailCopied: "E-mail copiado",
    copyUnavailable: "Selecione o e-mail e copie manualmente.",
    emailPending: "E-mail público aguardando aprovação.",
    manualEmailLabel: "E-mail para cópia manual",
  },
  privacyNotice: "Usaremos seus dados apenas para responder a esta conversa.",
}

const content = {
  id: "contact" as const,
  title: "Vamos construir algo que continue evoluindo.",
  commercialNote: "A conversa inicial é gratuita.",
  ctaLabel: "Iniciar conversa",
  publicEmail: {
    label: "E-mail",
    address: "hello@voynan.com",
    approval: "approved" as const,
  },
  social: [
    {
      platform: "linkedin" as const,
      label: "LinkedIn",
      approval: "missing" as const,
    },
  ],
  privacyPolicy: {
    label: "Política de privacidade",
    href: "/pt/privacidade",
    approval: "approved" as const,
  },
  terms: { label: "Termos", approval: "missing" as const },
  copyApproval: "received" as const,
}

function renderContact(
  submit: () => Promise<{ submissionId: string }>,
  clipboard: { writeText(text: string): Promise<void> } | null = null,
  trackEvent?: (event: AllowedEvent) => unknown,
) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ContactSection
        content={content}
        labels={labels}
        requestAntispamToken={async () => "verified-token"}
        submit={submit}
        clipboard={clipboard}
        trackEvent={trackEvent}
      />
    </QueryClientProvider>,
  )
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^nome$/i), "Ada Lovelace")
  await user.type(screen.getByLabelText(/e-mail/i), "ada@example.org")
  await user.type(
    screen.getByLabelText(/mensagem/i),
    "Quero conversar sobre um produto.",
  )
}

afterEach(cleanup)

it("links the contact notice to the approved privacy policy", () => {
  renderContact(vi.fn())

  expect(
    screen.getByRole("link", { name: "Política de privacidade" }),
  ).toHaveAttribute("href", "/pt/privacidade")
})

it("announces invalid fields and focuses the accessible error summary", async () => {
  const user = userEvent.setup()
  renderContact(vi.fn())

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  const summary = screen.getByRole("alert")
  expect(summary).toHaveTextContent("Revise os campos indicados.")
  expect(summary).toHaveFocus()
  expect(screen.getByLabelText(/^nome$/i)).toHaveAttribute(
    "aria-invalid",
    "true",
  )
})

it("exposes a stable submitting state without retrying", async () => {
  const user = userEvent.setup()
  const submit = vi.fn(() => new Promise<{ submissionId: string }>(() => {}))
  renderContact(submit)
  await fillValidForm(user)

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  expect(screen.getByRole("button", { name: "Enviando…" })).toHaveAttribute(
    "aria-busy",
    "true",
  )
  expect(submit).toHaveBeenCalledTimes(1)
  expect(screen.getByLabelText(/^nome$/i)).toHaveValue("Ada Lovelace")
  expect(screen.getByLabelText(/e-mail/i)).toHaveValue("ada@example.org")
  expect(screen.getByLabelText(/mensagem/i)).toHaveValue(
    "Quero conversar sobre um produto.",
  )
})

it("confirms success in context and clears the submitted fields", async () => {
  const user = userEvent.setup()
  renderContact(async () => ({ submissionId: "submission-42" }))
  await fillValidForm(user)

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  const success = await screen.findByText("Mensagem enviada.")
  expect(success).toBeVisible()
  expect(success).toHaveAttribute("role", "status")
  expect(screen.getByLabelText(/^nome$/i)).toHaveValue("")
  expect(screen.getByLabelText(/mensagem/i)).toHaveValue("")
})

it("reports first contact, success, and confirmed email copy without payload data", async () => {
  const user = userEvent.setup()
  const events: AllowedEvent[] = []
  renderContact(
    async () => ({ submissionId: "submission-42" }),
    { writeText: async () => undefined },
    (event) => events.push(event),
  )

  await fillValidForm(user)
  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))
  await screen.findByText(labels.status.success)
  await user.click(screen.getByRole("button", { name: /copiar e-mail/i }))

  expect(events).toEqual([
    { name: "contact_start" },
    { name: "contact_submit_success" },
    { name: "email_copy" },
  ])
})

it("reports the normalized contact error reason without field values", async () => {
  const user = userEvent.setup()
  const events: AllowedEvent[] = []
  renderContact(
    async () => {
      throw new ContactSubmissionError("rejected")
    },
    null,
    (event) => events.push(event),
  )

  await fillValidForm(user)
  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))
  await screen.findByText(labels.status.failure)

  expect(events).toEqual([
    { name: "contact_start" },
    { name: "contact_submit_error", reason: "rejected" },
  ])
})

it("preserves every field and emphasizes email after rejection", async () => {
  const user = userEvent.setup()
  renderContact(async () => {
    throw new ContactSubmissionError("rejected")
  })
  await fillValidForm(user)

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  expect(await screen.findByText(labels.status.failure)).toBeVisible()
  expect(screen.getByLabelText(/^nome$/i)).toHaveValue("Ada Lovelace")
  expect(screen.getByLabelText(/e-mail/i)).toHaveValue("ada@example.org")
  expect(screen.getByLabelText(/mensagem/i)).toHaveValue(
    "Quero conversar sobre um produto.",
  )
  expect(screen.getByRole("button", { name: /copiar e-mail/i })).toHaveFocus()
})

it("announces timeouts with the same preserved fallback", async () => {
  const user = userEvent.setup()
  renderContact(async () => {
    throw new ContactSubmissionError("timeout")
  })
  await fillValidForm(user)

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  expect(await screen.findByText(labels.status.timeout)).toBeVisible()
  expect(screen.getByLabelText(/mensagem/i)).toHaveValue(
    "Quero conversar sobre um produto.",
  )
  expect(screen.getByRole("button", { name: /copiar e-mail/i })).toHaveFocus()
})

it("normalizes a network failure in the component without losing input", async () => {
  const user = userEvent.setup()
  renderContact(async () => {
    throw new Error("offline")
  })
  await fillValidForm(user)

  await user.click(screen.getByRole("button", { name: /iniciar conversa/i }))

  expect(await screen.findByText(labels.status.failure)).toBeVisible()
  expect(screen.getByLabelText(/mensagem/i)).toHaveValue(
    "Quero conversar sobre um produto.",
  )
  expect(screen.getByRole("button", { name: /copiar e-mail/i })).toHaveFocus()
})

it("presents an honest unavailable state when no antispam adapter is configured", () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <ContactSection content={content} labels={labels} />
    </QueryClientProvider>,
  )

  expect(
    screen.getByRole("button", { name: /iniciar conversa/i }),
  ).toBeDisabled()
  expect(screen.getByLabelText(/^nome$/i)).toBeDisabled()
  expect(screen.getByLabelText(/^e-mail$/i)).toBeDisabled()
  expect(screen.getByLabelText(/^mensagem$/i)).toBeDisabled()
  expect(screen.getByText(labels.status.unavailable)).toBeVisible()
})

it("selects the address for manual copying when Clipboard API is unavailable", async () => {
  const user = userEvent.setup()
  renderContact(async () => ({ submissionId: "unused" }))

  await user.click(screen.getByRole("button", { name: /copiar e-mail/i }))

  const manualEmail = screen.getByRole("textbox", {
    name: /e-mail para cópia manual/i,
  }) as HTMLInputElement
  expect(manualEmail).toHaveFocus()
  await waitFor(() => expect(manualEmail.selectionStart).toBe(0))
  expect(manualEmail.selectionEnd).toBe("hello@voynan.com".length)
  expect(screen.getByText(labels.feedback.copyUnavailable)).toBeVisible()
})
