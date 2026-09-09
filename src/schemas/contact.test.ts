import { describe, expect, it } from "vitest"

import { contactInputSchema } from "@/schemas/contact"

describe("contactInputSchema", () => {
  it("normalizes a complete contact request", () => {
    expect(
      contactInputSchema.parse({
        name: "  Ada Lovelace  ",
        email: "  ada@example.org  ",
        message: "  Quero conversar sobre um produto.  ",
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.org",
      message: "Quero conversar sobre um produto.",
    })
  })

  it("rejects blank fields and malformed email addresses", () => {
    const result = contactInputSchema.safeParse({
      name: "  ",
      email: "not-an-email",
      message: "  ",
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual([
      "name",
      "email",
      "message",
    ])
  })
})

describe("contactInputSchema length limits", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.org",
    message: "Hello.",
  }

  it("accepts a message at the maximum length", () => {
    const result = contactInputSchema.safeParse({
      ...valid,
      message: "a".repeat(5000),
    })

    expect(result.success).toBe(true)
  })

  it("rejects fields above their maximum length", () => {
    const result = contactInputSchema.safeParse({
      name: "a".repeat(101),
      email: `${"a".repeat(200)}@example.org`,
      message: "a".repeat(5001),
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual([
      "name",
      "email",
      "message",
    ])
  })
})
