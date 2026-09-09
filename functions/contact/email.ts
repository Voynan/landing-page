import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2"

import type { ContactSubmission } from "../../src/schemas/contact"

export type EmailOptions = {
  from: string
  recipients: string[]
}

// eslint-disable-next-line no-control-regex
const controlCharacters = /[\u0000-\u001F\u007F]/g

export function stripControlCharacters(value: string): string {
  return value.replace(controlCharacters, " ").trim()
}

export function buildContactEmail(
  submission: ContactSubmission,
  { from, recipients }: EmailOptions,
): SendEmailCommandInput {
  const name = stripControlCharacters(submission.name)
  const email = stripControlCharacters(submission.email)

  return {
    FromEmailAddress: from,
    Destination: { ToAddresses: recipients },
    ReplyToAddresses: [email],
    Content: {
      Simple: {
        Subject: { Data: `Contact from ${name}`, Charset: "UTF-8" },
        Body: {
          Text: {
            Data: `${name}\n${email}\n\n${submission.message}`,
            Charset: "UTF-8",
          },
        },
      },
    },
  }
}
