import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import { prerender } from "./prerender.js"

const temporaryDirectories: string[] = []

async function createFixture(rendererSource: string) {
  const root = await mkdtemp(join(tmpdir(), "voynan-prerender-"))
  const clientDir = join(root, "client")
  const serverEntry = join(root, "entry-server.mjs")

  temporaryDirectories.push(root)

  await mkdir(clientDir, { recursive: true })
  await writeFile(
    join(clientDir, "index.html"),
    '<!doctype html><html lang="pt-BR"><head><title>Voynan</title></head><body><div id="root"></div></body></html>',
    "utf8",
  )
  await writeFile(serverEntry, rendererSource, "utf8")

  return { clientDir, serverEntry }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

describe("static prerender", () => {
  it("writes both locale pages idempotently from the client template", async () => {
    const fixture = await createFixture(`
      export async function render(url) {
        const locale = url.slice(1)
        return {
          appHtml: \`<main data-locale="\${locale}">Voynan</main>\`,
          headHtml: \`<meta name="rendered-locale" content="\${locale}" />\`,
          htmlAttrs: locale === "pt" ? 'lang="pt-BR"' : 'lang="en"',
        }
      }
    `)

    await prerender(fixture)

    const firstPortugueseOutput = await readFile(
      join(fixture.clientDir, "pt", "index.html"),
      "utf8",
    )
    const firstEnglishOutput = await readFile(
      join(fixture.clientDir, "en", "index.html"),
      "utf8",
    )

    await prerender(fixture)

    expect(
      await readFile(join(fixture.clientDir, "pt", "index.html"), "utf8"),
    ).toBe(firstPortugueseOutput)
    expect(
      await readFile(join(fixture.clientDir, "en", "index.html"), "utf8"),
    ).toBe(firstEnglishOutput)
    expect(firstPortugueseOutput).toContain('<html lang="pt-BR">')
    expect(firstPortugueseOutput).toContain('<main data-locale="pt">')
    expect(firstEnglishOutput).toContain('<html lang="en">')
    expect(firstEnglishOutput).toContain('<main data-locale="en">')
    expect(firstEnglishOutput).toContain('name="rendered-locale" content="en"')
  })

  it("rejects output without a primary main landmark", async () => {
    const fixture = await createFixture(`
      export async function render() {
        return {
          appHtml: "<div>Voynan</div>",
          headHtml: "",
          htmlAttrs: 'lang="pt-BR"',
        }
      }
    `)

    await expect(prerender(fixture)).rejects.toThrow(/<main>/i)
    await expect(
      access(join(fixture.clientDir, "pt", "index.html")),
    ).rejects.toThrow()
  })

  it("replaces template metadata with the locale-specific head", async () => {
    const fixture = await createFixture(`
      export async function render(url) {
        const locale = url.slice(1)
        return {
          appHtml: \`<main>\${locale}</main>\`,
          headHtml: \`<title>Voynan \${locale}</title><link rel="canonical" href="https://voynan.com/\${locale}" />\`,
          htmlAttrs: locale === "pt" ? 'lang="pt-BR"' : 'lang="en"',
        }
      }
    `)

    await prerender(fixture)

    const portugueseOutput = await readFile(
      join(fixture.clientDir, "pt", "index.html"),
      "utf8",
    )

    expect(portugueseOutput.match(/<title>/g)).toHaveLength(1)
    expect(portugueseOutput).toContain("<title>Voynan pt</title>")
    expect(portugueseOutput).toContain(
      'rel="canonical" href="https://voynan.com/pt"',
    )
  })
})
