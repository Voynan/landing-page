import { describe, expect, it } from "vitest"

import { buildContactEmail } from "./email"

const options = {
  from: "contact@voynan.com",
  recipients: ["kvsgpro@outlook.com", "contact@voynan.com"],
}

const submission = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  message: "I would like to talk about a product.",
  antispamToken: "token",
}

describe("buildContactEmail", () => {
  it("sends from the verified address to the fixed recipients and replies to the visitor", () => {
    const command = buildContactEmail(submission, options)

    expect(command.FromEmailAddress).toBe("contact@voynan.com")
    expect(command.Destination?.ToAddresses).toEqual(options.recipients)
    expect(command.ReplyToAddresses).toEqual(["ada@example.org"])
  })

  it("carries the name in the subject and the whole submission in the body", () => {
    const command = buildContactEmail(submission, options)

    expect(command.Content?.Simple?.Subject?.Data).toBe(
      "Contact from Ada Lovelace",
    )
    expect(command.Content?.Simple?.Body?.Text?.Data).toBe(
      "Ada Lovelace\nada@example.org\n\nI would like to talk about a product.",
    )
  })

  it("strips control characters so a name cannot forge a header", () => {
    const command = buildContactEmail(
      { ...submission, name: "Ada\r\nBcc: victim@example.org" },
      options,
    )

    const subject = command.Content?.Simple?.Subject?.Data ?? ""

    expect(subject).not.toContain("\n")
    expect(subject).not.toContain("\r")
  })

  it("keeps the reply address free of injected line breaks", () => {
    const command = buildContactEmail(
      { ...submission, email: "ada@example.org\r\nBcc: victim@example.org" },
      options,
    )

    expect(command.ReplyToAddresses?.[0]).not.toContain("\n")
    expect(command.ReplyToAddresses?.[0]).not.toContain("\r")
  })
})
