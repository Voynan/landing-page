import { forwardRef } from "react"

import type { ContactFieldErrors } from "@/forms/ContactFields"

type ErrorSummaryProps = {
  errors: ContactFieldErrors
  fieldLabels: Record<keyof ContactFieldErrors, string>
  idPrefix?: string
  title: string
}

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary(
    { errors, fieldLabels, idPrefix = "contact", title },
    ref,
  ) {
    const entries = Object.entries(errors) as Array<
      [keyof ContactFieldErrors, string]
    >

    if (entries.length === 0) return null

    return (
      <div
        className="contact-error-summary"
        ref={ref}
        role="alert"
        tabIndex={-1}
      >
        <strong>{title}</strong>
        <ul>
          {entries.map(([name, message]) => (
            <li key={name}>
              <a href={`#${idPrefix}-${name}`}>
                {fieldLabels[name]}: {message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  },
)

export type { ErrorSummaryProps }
