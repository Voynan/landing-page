import { describe, expect, it } from "vitest"

import { parseContactRequest, type FunctionUrlEvent } from "./request"

const allowedOrigin = "https://voynan.com"

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  message: "I would like to talk about a product.",
  antispamToken: "token-from-turnstile",
}

function buildEvent(
  overrides: Partial<FunctionUrlEvent> = {},
): FunctionUrlEvent {
  return {
    requestContext: { http: { method: "POST", sourceIp: "203.0.113.7" } },
    headers: { origin: allowedOrigin },
    body: JSON.stringify(validBody),
    ...overrides,
  }
}

describe("parseContactRequest", () => {
  it("returns the validated submission and the caller address for a well-formed request", () => {
    expect(parseContactRequest(buildEvent(), allowedOrigin)).toEqual({
      ok: true,
      submission: validBody,
      sourceIp: "203.0.113.7",
    })
  })

  it("rejects any method other than POST", () => {
    const event = buildEvent()
    event.requestContext.http.method = "GET"

    expect(parseContactRequest(event, allowedOrigin)).toEqual({
      ok: false,
      status: 405,
    })
  })

  it("rejects a request from another origin", () => {
    expect(
      parseContactRequest(
        buildEvent({ headers: { origin: "https://attacker.example" } }),
        allowedOrigin,
      ),
    ).toEqual({ ok: false, status: 403 })
  })

  it("rejects a request with no origin at all", () => {
    expect(parseContactRequest(buildEvent({ headers: {} }), allowedOrigin)).toEqual(
      { ok: false, status: 403 },
    )
  })

  it("rejects a body that is not JSON", () => {
    expect(
      parseContactRequest(buildEvent({ body: "not json" }), allowedOrigin),
    ).toEqual({ ok: false, status: 400 })
  })

  it("rejects a submission whose message exceeds the shared limit", () => {
    expect(
      parseContactRequest(
        buildEvent({
          body: JSON.stringify({ ...validBody, message: "a".repeat(5001) }),
        }),
        allowedOrigin,
      ),
    ).toEqual({ ok: false, status: 400 })
  })

  it("ignores any recipient the caller tries to supply", () => {
    expect(
      parseContactRequest(
        buildEvent({
          body: JSON.stringify({ ...validBody, to: "victim@example.org" }),
        }),
        allowedOrigin,
      ),
    ).toEqual({
      ok: true,
      submission: validBody,
      sourceIp: "203.0.113.7",
    })
  })

  it("decodes a base64 body", () => {
    expect(
      parseContactRequest(
        buildEvent({
          body: Buffer.from(JSON.stringify(validBody)).toString("base64"),
          isBase64Encoded: true,
        }),
        allowedOrigin,
      ),
    ).toEqual({
      ok: true,
      submission: validBody,
      sourceIp: "203.0.113.7",
    })
  })
})
