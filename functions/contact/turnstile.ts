export const siteverifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify"

type SiteverifyResponse = {
  success?: boolean
  hostname?: string
}

export type TurnstileOptions = {
  secret: string
  expectedHostname: string
}

// Every failure resolves to false rather than throwing, so an outage at
// Cloudflare closes the form instead of opening it.
export async function verifyTurnstileToken(
  token: string,
  remoteIp: string,
  { secret, expectedHostname }: TurnstileOptions,
): Promise<boolean> {
  try {
    const response = await fetch(siteverifyUrl, {
      method: "POST",
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: remoteIp,
      }),
    })

    if (!response.ok) return false

    const result = (await response.json()) as SiteverifyResponse

    return result.success === true && result.hostname === expectedHostname
  } catch {
    return false
  }
}
