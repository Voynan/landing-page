import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState, type RefObject } from "react"

import { Button } from "@/components/ui/button"
import { LiveRegion } from "@/components/ui/LiveRegion"
import { cn } from "@/lib/utils"
import { track, type AnalyticsTrack } from "@/lib/analytics"
import {
  copyText,
  type ClipboardWriter,
  type CopyTextResult,
} from "@/utils/clipboard"

type CopyEmailLabels = {
  copyEmail: string
  emailCopied: string
  copyUnavailable: string
  manualEmailLabel: string
}

type CopyEmailActionProps = {
  buttonRef?: RefObject<HTMLButtonElement | null>
  clipboard?: ClipboardWriter | null
  email: string
  emphasized?: boolean
  initialResult?: CopyTextResult | "idle"
  labels: CopyEmailLabels
  trackEvent?: AnalyticsTrack
}

export function CopyEmailAction({
  buttonRef,
  clipboard,
  email,
  emphasized = false,
  initialResult = "idle",
  labels,
  trackEvent = track,
}: CopyEmailActionProps) {
  const [result, setResult] = useState<CopyTextResult | "idle">(initialResult)
  const manualInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (result !== "copied") return

    const timeout = window.setTimeout(() => setResult("idle"), 2_000)
    return () => window.clearTimeout(timeout)
  }, [result])

  useEffect(() => {
    if (result !== "manual") return

    manualInputRef.current?.focus()
    manualInputRef.current?.select()
  }, [result])

  const handleCopy = async () => {
    const nextResult = await copyText(
      email,
      clipboard === null
        ? null
        : (clipboard ?? globalThis.navigator?.clipboard),
    )
    setResult(nextResult)
    if (nextResult === "copied") trackEvent({ name: "email_copy" })
  }

  return (
    <div
      className="copy-email-action"
      data-emphasized={emphasized || undefined}
    >
      <a href={`mailto:${email}`}>{email}</a>
      <Button
        ref={buttonRef}
        className="copy-email-action__button"
        data-state={result}
        type="button"
        variant={emphasized ? "default" : "outline"}
        onClick={() => void handleCopy()}
      >
        <span
          className="copy-email-action__icon"
          key={result === "copied" ? "copied" : "idle"}
        >
          {result === "copied" ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
        </span>
        {result === "copied" ? labels.emailCopied : labels.copyEmail}
      </Button>

      {result === "manual" ? (
        <input
          ref={manualInputRef}
          className="copy-email-action__manual"
          aria-label={labels.manualEmailLabel}
          readOnly
          value={email}
        />
      ) : null}

      {/* The control already shows the confirmation, so the copied state is
          announced only; the manual instruction stays visible because it
          explains the field that appears beside it. */}
      <LiveRegion
        className={cn(
          "copy-email-action__status",
          result !== "manual" && "sr-only",
        )}
        message={
          result === "copied"
            ? labels.emailCopied
            : result === "manual"
              ? labels.copyUnavailable
              : ""
        }
      />
    </div>
  )
}

export type { CopyEmailActionProps, CopyEmailLabels }
