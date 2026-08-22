import { useState } from "react"

import { LiveRegion } from "@/components/ui/LiveRegion"

type RealCodeSampleLabels = {
  copyCode: string
  copied: string
  copyFailed: string
}

type RealCodeSampleProps = {
  code: string
  labels: RealCodeSampleLabels
}

type CopyStatus = "idle" | "copied" | "failed"

export function RealCodeSample({ code, labels }: RealCodeSampleProps) {
  const [status, setStatus] = useState<CopyStatus>("idle")

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  const liveMessage =
    status === "copied"
      ? labels.copied
      : status === "failed"
        ? labels.copyFailed
        : ""

  return (
    <div className="real-code-sample">
      <div className="real-code-sample__toolbar">
        <span aria-hidden="true">Aegis</span>
        <button type="button" onClick={copyCode}>
          {labels.copyCode}
        </button>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
      <LiveRegion
        className="real-code-sample__feedback"
        message={liveMessage}
      />
    </div>
  )
}

export type { RealCodeSampleLabels, RealCodeSampleProps }
