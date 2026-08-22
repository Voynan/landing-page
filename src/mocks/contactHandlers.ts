import { delay, http, HttpResponse } from "msw"

export const contactFixtureEndpoint = "https://contact.test/messages"

export const contactHandlers = {
  success: http.post(contactFixtureEndpoint, () =>
    HttpResponse.json({ submissionId: "fixture-submission" }),
  ),
  validation: http.post(contactFixtureEndpoint, () =>
    HttpResponse.json({ code: "invalid" }, { status: 422 }),
  ),
  rejected: http.post(contactFixtureEndpoint, () =>
    HttpResponse.json({ code: "unavailable" }, { status: 503 }),
  ),
  timeout: http.post(contactFixtureEndpoint, async () => {
    await delay("infinite")
    return HttpResponse.json({ submissionId: "unreachable" })
  }),
  network: http.post(contactFixtureEndpoint, () => HttpResponse.error()),
} as const
