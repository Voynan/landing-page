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
