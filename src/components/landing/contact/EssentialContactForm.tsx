import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { Check, LoaderCircle, TriangleAlert } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

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
import { antispamSlotAttribute } from "@/lib/turnstile"
import { cn } from "@/lib/utils"

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
    sent: string
    retry: string
    success: string
    failure: string
    timeout: string
    unavailable: string
  }
  feedback: CopyEmailActionProps["labels"] & {
    emailPending: string
  }
  alternativeLabel: string
  privacyNotice: string
  antispam: {
    notice: string
    privacyLabel: string
    conjunction: string
    termsLabel: string
  }
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
  privacyPolicy?: { href: string; label: string }
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

function isRecoverableFailure(phase: ContactFormPhase): boolean {
  return phase === "failure" || phase === "timeout"
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
  privacyPolicy,
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
    if (autoFocusRecovery && isRecoverableFailure(phase) && publicEmail) {
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

  const submitDisabled = phase === "submitting" || !requestAntispamToken
  const submitLabel =
    phase === "submitting"
      ? labels.status.submitting
      : phase === "success"
        ? labels.status.sent
        : isRecoverableFailure(phase)
          ? labels.status.retry
          : ctaLabel

  const submitIcon: ReactNode =
    phase === "submitting" ? (
      <LoaderCircle aria-hidden="true" className="contact-submit__spinner" />
    ) : phase === "success" ? (
      <Check aria-hidden="true" />
    ) : isRecoverableFailure(phase) ? (
      <TriangleAlert aria-hidden="true" />
    ) : null

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
    if (phase === "success" || isRecoverableFailure(phase)) setPhase("empty")
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

        <div
          className="essential-contact-form__antispam"
          {...{ [antispamSlotAttribute]: "" }}
        />

        <div className="essential-contact-form__consent">
          <p>
            {labels.privacyNotice}{" "}
            {privacyPolicy ? (
              <a href={privacyPolicy.href}>{privacyPolicy.label}</a>
            ) : null}{" "}
            {labels.antispam.notice}{" "}
            <a href="https://www.cloudflare.com/turnstile-privacy-policy/">
              {labels.antispam.privacyLabel}
            </a>{" "}
            {labels.antispam.conjunction}{" "}
            <a href="https://www.cloudflare.com/website-terms/">
              {labels.antispam.termsLabel}
            </a>
            .
          </p>
        </div>

        <div className="essential-contact-form__actions">
          <Button
            className={cn(
              "contact-submit min-w-48",
              phase === "success" &&
                "bg-[var(--color-copper-light)] hover:bg-[var(--color-copper-light)]",
            )}
            data-phase={phase}
            type="submit"
            variant={isRecoverableFailure(phase) ? "destructive" : "default"}
            aria-busy={phase === "submitting" ? "true" : undefined}
            disabled={submitDisabled}
          >
            <span aria-hidden="true" className="contact-submit__sweep" />
            {submitIcon ? (
              <span key={`icon-${phase}`} className="contact-submit__icon">
                {submitIcon}
              </span>
            ) : null}
            <span key={`label-${phase}`} className="contact-submit__label">
              {submitLabel}
            </span>
          </Button>
        </div>
      </form>

      {/* The transformed submit control, and the disabled controls of the
          unavailable state, are the visible outcome. The sentence stays in the
          live region for assistive technology and only becomes visible when it
          carries recovery guidance the control cannot state on its own. */}
      <LiveRegion
        className={cn(
          "essential-contact-form__status",
          isRecoverableFailure(phase) &&
            "essential-contact-form__status--recovery",
          !isRecoverableFailure(phase) && "sr-only",
        )}
        message={statusMessage}
        politeness={isRecoverableFailure(phase) ? "assertive" : "polite"}
      />

      <div className="essential-contact-form__divider">
        <span>{labels.alternativeLabel}</span>
      </div>

      <div className="essential-contact-form__fallback">
        {publicEmail ? (
          <CopyEmailAction
            buttonRef={emailButtonRef}
            clipboard={clipboard}
            email={publicEmail}
            emphasized={isRecoverableFailure(phase)}
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
