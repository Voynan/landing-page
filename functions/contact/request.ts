import {
  contactSubmissionSchema,
  type ContactSubmission,
} from "../../src/schemas/contact"

export type FunctionUrlEvent = {
  requestContext: { http: { method: string; sourceIp: string } }
  headers: Record<string, string | undefined>
  body?: string
  isBase64Encoded?: boolean
}

export type ParsedRequest =
  | { ok: true; submission: ContactSubmission; sourceIp: string }
  | { ok: false; status: 400 | 403 | 405 }

function readBody(event: FunctionUrlEvent): unknown {
  if (!event.body) return null

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function parseContactRequest(
  event: FunctionUrlEvent,
  allowedOrigin: string,
): ParsedRequest {
  if (event.requestContext.http.method !== "POST") {
    return { ok: false, status: 405 }
  }

  const origin = event.headers.origin ?? event.headers.Origin

  if (origin !== allowedOrigin) {
    return { ok: false, status: 403 }
  }

  // safeParse strips unknown keys, so a caller-supplied recipient field
  // disappears here rather than travelling any further.
  const parsed = contactSubmissionSchema.safeParse(readBody(event))

  if (!parsed.success) {
    return { ok: false, status: 400 }
  }

  return {
    ok: true,
    submission: parsed.data,
    sourceIp: event.requestContext.http.sourceIp,
  }
}
