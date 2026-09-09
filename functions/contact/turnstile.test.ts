import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { siteverifyUrl, verifyTurnstileToken } from "./turnstile"

const server = setupServer()
const options = { secret: "secret-value", expectedHostname: "voynan.com" }

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("verifyTurnstileToken", () => {
  it("accepts a token Cloudflare confirms for the expected hostname", async () => {
    let sent: URLSearchParams | undefined

    server.use(
      http.post(siteverifyUrl, async ({ request }) => {
        sent = new URLSearchParams(await request.text())
        return HttpResponse.json({ success: true, hostname: "voynan.com" })
      }),
    )

    await expect(
      verifyTurnstileToken("a-token", "203.0.113.7", options),
    ).resolves.toBe(true)

    expect(sent?.get("secret")).toBe("secret-value")
    expect(sent?.get("response")).toBe("a-token")
    expect(sent?.get("remoteip")).toBe("203.0.113.7")
  })

  it("refuses a replayed token", async () => {
    server.use(
      http.post(siteverifyUrl, () =>
        HttpResponse.json({
          success: false,
          "error-codes": ["timeout-or-duplicate"],
        }),
      ),
    )

    await expect(
      verifyTurnstileToken("a-token", "203.0.113.7", options),
    ).resolves.toBe(false)
  })

  it("refuses a token solved on another hostname", async () => {
    server.use(
      http.post(siteverifyUrl, () =>
        HttpResponse.json({ success: true, hostname: "attacker.example" }),
      ),
    )

    await expect(
      verifyTurnstileToken("a-token", "203.0.113.7", options),
    ).resolves.toBe(false)
  })

  it("refuses when Cloudflare answers with an error status", async () => {
    server.use(
      http.post(siteverifyUrl, () => new HttpResponse(null, { status: 500 })),
    )

    await expect(
      verifyTurnstileToken("a-token", "203.0.113.7", options),
    ).resolves.toBe(false)
  })

  it("refuses when Cloudflare is unreachable", async () => {
    server.use(http.post(siteverifyUrl, () => HttpResponse.error()))

    await expect(
      verifyTurnstileToken("a-token", "203.0.113.7", options),
    ).resolves.toBe(false)
  })
})
