import type { SendEmailCommand } from "@aws-sdk/client-sesv2"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { createContactHandler } from "./handler"
import type { FunctionUrlEvent } from "./request"
import { siteverifyUrl } from "./turnstile"

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  process.env.TURNSTILE_SECRET = "secret-value"
  process.env.CONTACT_FROM_ADDRESS = "contact@voynan.com"
  process.env.CONTACT_RECIPIENTS = "kvsgpro@outlook.com,contact@voynan.com"
  process.env.ALLOWED_ORIGIN = "https://voynan.com"
})

function acceptToken() {
  server.use(
    http.post(siteverifyUrl, () =>
      HttpResponse.json({ success: true, hostname: "voynan.com" }),
    ),
  )
}

function buildEvent(): FunctionUrlEvent {
  return {
    requestContext: { http: { method: "POST", sourceIp: "203.0.113.7" } },
    headers: { origin: "https://voynan.com" },
    body: JSON.stringify({
      name: "Ada Lovelace",
      email: "ada@example.org",
      message: "I would like to talk about a product.",
      antispamToken: "token-from-turnstile",
    }),
  }
}

describe("contact handler", () => {
  it("returns the SES message id as the submission id", async () => {
    acceptToken()
    const send = vi.fn().mockResolvedValue({ MessageId: "ses-message-id" })

    const response = await createContactHandler({ send })(buildEvent())

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      submissionId: "ses-message-id",
    })
  })

  it("delivers only to the configured recipients", async () => {
    acceptToken()
    const send = vi.fn().mockResolvedValue({ MessageId: "ses-message-id" })

    await createContactHandler({ send })(buildEvent())

    const command = send.mock.calls[0][0] as SendEmailCommand

    expect(command.input.Destination?.ToAddresses).toEqual([
      "kvsgpro@outlook.com",
      "contact@voynan.com",
    ])
  })

  it("never reaches SES when the token is refused", async () => {
    server.use(
      http.post(siteverifyUrl, () => HttpResponse.json({ success: false })),
    )
    const send = vi.fn()

    const response = await createContactHandler({ send })(buildEvent())

    expect(response.statusCode).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })

  it("never reaches Cloudflare when the body is invalid", async () => {
    const send = vi.fn()
    const event = buildEvent()
    event.body = JSON.stringify({ name: "", email: "no", message: "" })

    const response = await createContactHandler({ send })(event)

    expect(response.statusCode).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it("reports a delivery failure without leaking the reason", async () => {
    acceptToken()
    const send = vi.fn().mockRejectedValue(new Error("SES quota exceeded"))

    const response = await createContactHandler({ send })(buildEvent())

    expect(response.statusCode).toBe(502)
    expect(response.body).not.toContain("quota")
  })

  it("fails closed when a configured recipient is not a valid address", async () => {
    // A malformed recipient would otherwise surface as an opaque SES
    // BadRequestException, indistinguishable from a delivery outage.
    process.env.CONTACT_RECIPIENTS = "kvsgpro@outlook.com\\,contact@voynan.com"
    acceptToken()
    const send = vi.fn()

    const response = await createContactHandler({ send })(buildEvent())

    expect(response.statusCode).toBe(500)
    expect(send).not.toHaveBeenCalled()
  })

  it("fails closed when configuration is missing", async () => {
    delete process.env.TURNSTILE_SECRET
    const send = vi.fn()

    const response = await createContactHandler({ send })(buildEvent())

    expect(response.statusCode).toBe(500)
    expect(send).not.toHaveBeenCalled()
  })
})
