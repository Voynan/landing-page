import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)

    if (statSync(path).isDirectory()) return collectSourceFiles(path)

    return /\.tsx?$/.test(entry) ? [path] : []
  })
}

describe("module boundary", () => {
  it("keeps src free of any import from functions", () => {
    const offenders = collectSourceFiles("src").filter((path) =>
      /from\s+["'][^"']*\bfunctions\//.test(readFileSync(path, "utf8")),
    )

    expect(offenders).toEqual([])
  })
})
