import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
import { z } from "zod"

import { buildContactEmail } from "./email"
import { parseContactRequest, type FunctionUrlEvent } from "./request"
import { verifyTurnstileToken } from "./turnstile"

export type SesSender = {
  send: (command: SendEmailCommand) => Promise<{ MessageId?: string }>
}

export type FunctionUrlResult = {
  statusCode: number
  headers: Record<string, string>
  body: string
}

type Configuration = {
  turnstileSecret: string
  from: string
  recipients: string[]
  allowedOrigin: string
}

function reply(statusCode: number, payload: unknown = {}): FunctionUrlResult {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }
}

const addressSchema = z.string().trim().min(1).email()
const addressListSchema = z.array(addressSchema).min(1)

function readConfiguration(): Configuration | null {
  const turnstileSecret = process.env.TURNSTILE_SECRET
  const allowedOrigin = process.env.ALLOWED_ORIGIN
  const from = addressSchema.safeParse(process.env.CONTACT_FROM_ADDRESS)
  // Addresses are validated here rather than trusted, because a malformed
  // recipient reaches SES as an opaque BadRequestException that looks exactly
  // like a delivery outage. Catching it as configuration keeps the diagnosis
  // in the deploy, where the mistake actually is.
  const recipients = addressListSchema.safeParse(
    process.env.CONTACT_RECIPIENTS?.split(",")
      .map((address) => address.trim())
      .filter(Boolean),
  )

  if (!turnstileSecret || !allowedOrigin) return null
  if (!from.success || !recipients.success) return null

  return {
    turnstileSecret,
    from: from.data,
    recipients: recipients.data,
    allowedOrigin,
  }
}

export function createContactHandler(ses: SesSender) {
  return async function contactHandler(
    event: FunctionUrlEvent,
  ): Promise<FunctionUrlResult> {
    const configuration = readConfiguration()

    if (!configuration) {
      console.error("contact: refusing to run without complete configuration")
      return reply(500)
    }

    const parsed = parseContactRequest(event, configuration.allowedOrigin)

    if (!parsed.ok) return reply(parsed.status)

    const verified = await verifyTurnstileToken(
      parsed.submission.antispamToken,
      parsed.sourceIp,
      {
        secret: configuration.turnstileSecret,
        expectedHostname: new URL(configuration.allowedOrigin).hostname,
      },
    )

    if (!verified) return reply(403)

    try {
      const result = await ses.send(
        new SendEmailCommand(
          buildContactEmail(parsed.submission, {
            from: configuration.from,
            recipients: configuration.recipients,
          }),
        ),
      )

      // The submission id, the time and the outcome are the whole log. The
      // visitor's name, address and message never reach CloudWatch.
      console.info("contact: delivered", {
        submissionId: result.MessageId,
        at: new Date().toISOString(),
      })

      return reply(200, { submissionId: result.MessageId })
    } catch (error) {
      console.error("contact: delivery failed", {
        at: new Date().toISOString(),
        name: error instanceof Error ? error.name : "unknown",
      })

      return reply(502)
    }
  }
}

export const handler = createContactHandler(new SESv2Client({}))
