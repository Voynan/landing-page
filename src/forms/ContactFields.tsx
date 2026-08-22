import { Label } from "@/components/ui/label"
import type { ContactInput } from "@/schemas/contact"

export type ContactFieldName = keyof ContactInput
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>

type ContactFieldsProps = {
  disabled?: boolean
  errors: ContactFieldErrors
  idPrefix?: string
  labels: Record<ContactFieldName, string>
  onChange: (name: ContactFieldName, value: string) => void
  values: ContactInput
}

export function ContactFields({
  disabled = false,
  errors,
  idPrefix = "contact",
  labels,
  onChange,
  values,
}: ContactFieldsProps) {
  return (
    <div className="contact-fields">
      {(["name", "email"] as const).map((name) => {
        const fieldId = `${idPrefix}-${name}`
        const errorId = `${fieldId}-error`

        return (
          <div className="contact-field" key={name}>
            <Label htmlFor={fieldId}>{labels[name]}</Label>
            <input
              id={fieldId}
              name={name}
              type={name === "email" ? "email" : "text"}
              autoComplete={name}
              disabled={disabled}
              value={values[name]}
              aria-describedby={errors[name] ? errorId : undefined}
              aria-invalid={errors[name] ? "true" : undefined}
              onChange={(event) => onChange(name, event.currentTarget.value)}
            />
            {errors[name] ? (
              <p className="contact-field__error" id={errorId}>
                {errors[name]}
              </p>
            ) : null}
          </div>
        )
      })}

      <div className="contact-field contact-field--message">
        <Label htmlFor={`${idPrefix}-message`}>{labels.message}</Label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={7}
          disabled={disabled}
          value={values.message}
          aria-describedby={
            errors.message ? `${idPrefix}-message-error` : undefined
          }
          aria-invalid={errors.message ? "true" : undefined}
          onChange={(event) => onChange("message", event.currentTarget.value)}
        />
        {errors.message ? (
          <p className="contact-field__error" id={`${idPrefix}-message-error`}>
            {errors.message}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export type { ContactFieldsProps }
