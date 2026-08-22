import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { useEffect, useRef, useState } from "react"

import type { CopyEmailActionProps } from "@/components/landing/contact/CopyEmailAction"
import { CopyEmailAction } from "@/components/landing/contact/CopyEmailAction"
import { Button } from "@/components/ui/button"
import { LiveRegion } from "@/components/ui/LiveRegion"
import {
  ContactFields,
  type ContactFieldErrors,
  type ContactFieldName,
} from "@/forms/ContactFields"
import { ErrorSummary } from "@/forms/ErrorSummary"
import {
  contactInputSchema,
  type ContactInput,
  type ContactSubmissionResult,
} from "@/schemas/contact"
import {
  ContactSubmissionError,
  submitContact,
  type ContactError,
} from "@/services/contact"
import { track, type AnalyticsTrack } from "@/lib/analytics"

type ContactFormPhase =
  "empty" | "submitting" | "success" | "failure" | "timeout"

type ContactFormLabels = {
  fields: Record<ContactFieldName, string>
  validation: {
    required: string
    email: string
    summary: string
  }
  status: {
    submitting: string
    success: string
    failure: string
    timeout: string
    unavailable: string
  }
  feedback: CopyEmailActionProps["labels"] & {
    emailPending: string
  }
  privacyNotice: string
}

type EssentialContactFormProps = {
  autoFocusRecovery?: boolean
  clipboard?: CopyEmailActionProps["clipboard"]
  ctaLabel: string
  idPrefix?: string
  initialState?: {
    copyResult?: "idle" | "copied" | "manual"
    errors?: ContactFieldErrors
    phase?: ContactFormPhase
    values?: ContactInput
  }
  labels: ContactFormLabels
  publicEmail?: string
  requestAntispamToken?: () => Promise<string>
  submit?: (
    input: ContactInput,
    antispamToken: string,
  ) => Promise<ContactSubmissionResult>
  trackEvent?: AnalyticsTrack
}

const emptyContactInput: ContactInput = { name: "", email: "", message: "" }

function getFieldErrors(
  values: ContactInput,
  labels: ContactFormLabels["validation"],
): ContactFieldErrors {
  const result = contactInputSchema.safeParse(values)
  if (result.success) return {}

  const errors: ContactFieldErrors = {}

  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactFieldName | undefined
    if (!field || errors[field]) continue

    errors[field] =
      field === "email" && values.email.trim() ? labels.email : labels.required
  }

  return errors
}

function getErrorKind(error: unknown): ContactError {
  return error instanceof ContactSubmissionError ? error.kind : "network"
}

export function EssentialContactForm({
  autoFocusRecovery = true,
  clipboard,
  ctaLabel,
  idPrefix = "contact",
  initialState,
  labels,
  publicEmail,
  requestAntispamToken,
  submit = submitContact,
  trackEvent = track,
}: EssentialContactFormProps) {
  const [errors, setErrors] = useState<ContactFieldErrors>(
    initialState?.errors ?? {},
  )
  const [phase, setPhase] = useState<ContactFormPhase>(
    initialState?.phase ?? "empty",
  )
  const summaryRef = useRef<HTMLDivElement>(null)
  const emailButtonRef = useRef<HTMLButtonElement>(null)
  const contactStartedRef = useRef(false)

  const mutation = useMutation({
    mutationFn: async ({
      input,
      antispamToken,
    }: {
      input: ContactInput
      antispamToken: string
    }) => submit(input, antispamToken),
    retry: false,
  })

  const form = useForm({
    defaultValues: initialState?.values ?? emptyContactInput,
    onSubmit: async ({ value }) => {
      if (!requestAntispamToken) return

      const nextErrors = getFieldErrors(value, labels.validation)

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors)
        setPhase("empty")
        trackEvent({ name: "contact_submit_error", reason: "validation" })
        return
      }

      setErrors({})
      setPhase("submitting")

      try {
        const antispamToken = await requestAntispamToken()
        await mutation.mutateAsync({
          input: contactInputSchema.parse(value),
          antispamToken,
        })
        form.reset()
        setPhase("success")
        trackEvent({ name: "contact_submit_success" })
      } catch (error) {
        const errorKind = getErrorKind(error)
        setPhase(errorKind === "timeout" ? "timeout" : "failure")
        trackEvent({ name: "contact_submit_error", reason: errorKind })
      }
    },
  })

  useEffect(() => {
    if (autoFocusRecovery && Object.keys(errors).length > 0) {
      summaryRef.current?.focus()
    }
  }, [autoFocusRecovery, errors])

  useEffect(() => {
    if (
      autoFocusRecovery &&
      (phase === "failure" || phase === "timeout") &&
      publicEmail
    ) {
      emailButtonRef.current?.focus()
    }
  }, [autoFocusRecovery, phase, publicEmail])

  const statusMessage =
    phase === "success"
      ? labels.status.success
      : phase === "failure"
        ? labels.status.failure
        : phase === "timeout"
          ? labels.status.timeout
          : !requestAntispamToken
            ? labels.status.unavailable
            : ""

  const handleFieldChange = (name: ContactFieldName, value: string) => {
    if (name === "name") form.setFieldValue("name", value)
    if (name === "email") form.setFieldValue("email", value)
    if (name === "message") form.setFieldValue("message", value)

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
    if (phase === "success") setPhase("empty")
  }

  return (
    <div className="essential-contact-form">
      <form
        noValidate
        aria-busy={phase === "submitting" ? "true" : undefined}
        onFocusCapture={() => {
          if (contactStartedRef.current) return
          contactStartedRef.current = true
          trackEvent({ name: "contact_start" })
        }}
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <ErrorSummary
          ref={summaryRef}
          errors={errors}
          fieldLabels={labels.fields}
          idPrefix={idPrefix}
          title={labels.validation.summary}
        />

        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <ContactFields
              disabled={phase === "submitting" || !requestAntispamToken}
              errors={errors}
              idPrefix={idPrefix}
              labels={labels.fields}
              onChange={handleFieldChange}
              values={values}
            />
          )}
        </form.Subscribe>

        <div className="essential-contact-form__footer">
          <p>{labels.privacyNotice}</p>
          <Button
            type="submit"
            aria-busy={phase === "submitting" ? "true" : undefined}
            disabled={phase === "submitting" || !requestAntispamToken}
          >
            <span className="essential-contact-form__button-label">
              {phase === "submitting" ? labels.status.submitting : ctaLabel}
            </span>
          </Button>
        </div>
      </form>

      <LiveRegion
        className="essential-contact-form__status"
        message={statusMessage}
        politeness={
          phase === "failure" || phase === "timeout" ? "assertive" : "polite"
        }
      />

      <div className="essential-contact-form__fallback">
        {publicEmail ? (
          <CopyEmailAction
            buttonRef={emailButtonRef}
            clipboard={clipboard}
            email={publicEmail}
            emphasized={phase === "failure" || phase === "timeout"}
            initialResult={initialState?.copyResult}
            labels={labels.feedback}
            trackEvent={trackEvent}
          />
        ) : (
          <p>{labels.feedback.emailPending}</p>
        )}
      </div>
    </div>
  )
}

export type { ContactFormLabels, ContactFormPhase, EssentialContactFormProps }
