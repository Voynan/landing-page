import { QueryClientProvider } from "@tanstack/react-query"
import { useMemo } from "react"

import { EssentialContactForm } from "@/components/landing/contact/EssentialContactForm"
import { createQueryClient } from "@/lib/queryClient"

const labels = {
  fields: { name: "Name", email: "Email", message: "Message" },
  validation: {
    required: "Complete this field.",
    email: "Enter a valid email address.",
    summary: "Review the highlighted fields.",
  },
  status: {
    submitting: "Sending…",
    success: "Message sent.",
    failure: "The message could not be sent. Use the email fallback.",
    timeout: "The request took too long. Use the email fallback.",
    unavailable: "Submission is awaiting secure configuration.",
  },
  feedback: {
    copyEmail: "Copy email",
    emailCopied: "Email copied",
    copyUnavailable: "Select the email and copy it manually.",
    emailPending: "Public email awaiting approval.",
    manualEmailLabel: "Email for manual copying",
  },
  privacyNotice:
    "Technical fixture: these values are never sent to a production endpoint.",
} as const

const emptyValues = { name: "", email: "", message: "" }
const validValues = {
  name: "Technical fixture",
  email: "fixture@voynan.invalid",
  message: "Deterministic specimen state; no production request is made.",
}
const invalidErrors = {
  name: labels.validation.required,
  email: labels.validation.email,
  message: labels.validation.required,
}
const fixtureEmail = "contact@voynan.invalid"
const requestFixtureToken = async () => "fixture-token"
const submitFixture = async () => ({ submissionId: "fixture-submission" })

export function FormsSpecimen() {
  const queryClient = useMemo(() => createQueryClient(), [])

  return (
    <section id="forms" className="ds-specimen" aria-labelledby="forms-heading">
      <header className="ds-specimen__header">
        <h2 id="forms-heading">Forms</h2>
        <p>
          Production contact primitives expose recovery, focus, announcement,
          and no-retry behavior without calling a real endpoint.
        </p>
      </header>

      <QueryClientProvider client={queryClient}>
        <div className="ds-forms-bench">
          <article className="ds-form-state ds-form-state--live">
            <h3>Empty</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              ctaLabel="Start a conversation"
              idPrefix="specimen-empty"
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>

          <article className="ds-form-state">
            <h3>Invalid</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              ctaLabel="Start a conversation"
              idPrefix="specimen-invalid"
              initialState={{ errors: invalidErrors, values: emptyValues }}
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>

          <article className="ds-form-state">
            <h3>Submitting</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              ctaLabel="Start a conversation"
              idPrefix="specimen-submitting"
              initialState={{ phase: "submitting", values: validValues }}
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>

          <article className="ds-form-state">
            <h3>Success</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              ctaLabel="Start a conversation"
              idPrefix="specimen-success"
              initialState={{ phase: "success", values: emptyValues }}
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>

          <article className="ds-form-state">
            <h3>Failure</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              ctaLabel="Start a conversation"
              idPrefix="specimen-failure"
              initialState={{ phase: "failure", values: validValues }}
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>

          <article className="ds-form-state">
            <h3>Clipboard fallback</h3>
            <EssentialContactForm
              autoFocusRecovery={false}
              clipboard={null}
              ctaLabel="Start a conversation"
              idPrefix="specimen-clipboard"
              initialState={{
                copyResult: "manual",
                phase: "failure",
                values: validValues,
              }}
              labels={labels}
              publicEmail={fixtureEmail}
              requestAntispamToken={requestFixtureToken}
              submit={submitFixture}
            />
          </article>
        </div>
      </QueryClientProvider>
    </section>
  )
}
