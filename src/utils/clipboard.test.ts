import { describe, expect, it, vi } from "vitest"

import { copyText } from "@/utils/clipboard"

describe("copyText", () => {
  it("copies through the Clipboard API when it is available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)

    await expect(copyText("hello@voynan.com", { writeText })).resolves.toBe(
      "copied",
    )
    expect(writeText).toHaveBeenCalledWith("hello@voynan.com")
  })

  it("returns a manual fallback when clipboard access is unavailable", async () => {
    await expect(copyText("hello@voynan.com", undefined)).resolves.toBe(
      "manual",
    )
  })

  it("returns a manual fallback when clipboard permission is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"))

    await expect(copyText("hello@voynan.com", { writeText })).resolves.toBe(
      "manual",
    )
  })
})
