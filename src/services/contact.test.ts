import { delay, http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"

import { ContactSubmissionError, submitContact } from "@/services/contact"

const endpoint = "https://contact.test/messages"
const input = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  message: "Quero conversar sobre um produto.",
}

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("submitContact", () => {
  it("sends validated input and the antispam token", async () => {
    server.use(
      http.post(endpoint, async ({ request }) => {
        expect(await request.json()).toEqual({
          ...input,
          antispamToken: "verified-token",
        })

        return HttpResponse.json({ submissionId: "submission-42" })
      }),
    )

    await expect(
      submitContact(input, "verified-token", { endpoint }),
    ).resolves.toEqual({ submissionId: "submission-42" })
  })

  it.each([
    [422, "validation"],
    [503, "rejected"],
  ] as const)("normalizes HTTP %s as %s", async (status, kind) => {
    server.use(
      http.post(endpoint, () =>
        HttpResponse.json({ code: "unavailable" }, { status }),
      ),
    )

    await expect(
      submitContact(input, "verified-token", { endpoint }),
    ).rejects.toMatchObject({ kind })
  })

  it("normalizes bounded request timeouts", async () => {
    server.use(
      http.post(endpoint, async () => {
        await delay(40)
        return HttpResponse.json({ submissionId: "too-late" })
      }),
    )

    await expect(
      submitContact(input, "verified-token", { endpoint, timeout: 5 }),
    ).rejects.toMatchObject({ kind: "timeout" })
  })

  it("normalizes transport failures without exposing technical details", async () => {
    server.use(http.post(endpoint, () => HttpResponse.error()))

    try {
      await submitContact(input, "verified-token", { endpoint })
    } catch (error) {
      expect(error).toBeInstanceOf(ContactSubmissionError)
      expect(error).toMatchObject({ kind: "network" })
      expect((error as Error).message).toBe("Contact submission failed")
    }
  })
})
