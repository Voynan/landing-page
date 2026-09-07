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
  const localeRenderer = `
      export async function render(url) {
        const parsed = new URL(url, "https://voynan.local")
        const locale = parsed.searchParams.get("lang") === "pt" ? "pt" : "en"
        return {
          appHtml: \`<main data-locale="\${locale}" data-path="\${parsed.pathname}">Voynan</main>\`,
          headHtml: \`<meta name="rendered-locale" content="\${locale}" />\`,
          htmlAttrs: locale === "pt" ? 'lang="pt-BR"' : 'lang="en"',
        }
      }
    `

  it("writes both language variants idempotently from the client template", async () => {
    const fixture = await createFixture(localeRenderer)

    await prerender(fixture)

    const firstEnglishOutput = await readFile(
      join(fixture.clientDir, "index.html"),
      "utf8",
    )
    const firstPortugueseOutput = await readFile(
      join(fixture.clientDir, "_lang", "pt", "index.html"),
      "utf8",
    )

    await prerender(fixture)

    expect(await readFile(join(fixture.clientDir, "index.html"), "utf8")).toBe(
      firstEnglishOutput,
    )
    expect(
      await readFile(
        join(fixture.clientDir, "_lang", "pt", "index.html"),
        "utf8",
      ),
    ).toBe(firstPortugueseOutput)
    expect(firstEnglishOutput).toContain('<html lang="en">')
    expect(firstEnglishOutput).toContain('<main data-locale="en"')
    expect(firstEnglishOutput).toContain('name="rendered-locale" content="en"')
    expect(firstPortugueseOutput).toContain('<html lang="pt-BR">')
    expect(firstPortugueseOutput).toContain('<main data-locale="pt"')
  })

  it("writes every public document, with Portuguese under the internal tree", async () => {
    const fixture = await createFixture(localeRenderer)

    await prerender(fixture)

    const expectations = [
      ["index.html", "en", "/"],
      ["privacy/index.html", "en", "/privacy"],
      ["terms/index.html", "en", "/terms"],
      ["_lang/pt/index.html", "pt", "/"],
      ["_lang/pt/privacy/index.html", "pt", "/privacy"],
      ["_lang/pt/terms/index.html", "pt", "/terms"],
    ] as const

    for (const [file, locale, path] of expectations) {
      const html = await readFile(join(fixture.clientDir, file), "utf8")

      expect(html).toContain(`data-locale="${locale}"`)
      expect(html).toContain(`data-path="${path}"`)
    }
  })

  it("rejects output without a primary main landmark", async () => {
    const fixture = await createFixture(`
      export async function render() {
        return {
          appHtml: "<div>Voynan</div>",
          headHtml: "",
          htmlAttrs: 'lang="en"',
        }
      }
    `)

    await expect(prerender(fixture)).rejects.toThrow(/<main>/i)
    await expect(
      access(join(fixture.clientDir, "privacy", "index.html")),
    ).rejects.toThrow()
  })

  it("replaces template metadata with the locale-specific head", async () => {
    const fixture = await createFixture(`
      export async function render(url) {
        const parsed = new URL(url, "https://voynan.local")
        const locale = parsed.searchParams.get("lang") === "pt" ? "pt" : "en"
        return {
          appHtml: \`<main>\${locale}</main>\`,
          headHtml: \`<title>Voynan \${locale}</title><link rel="canonical" href="https://voynan.com/?lang=\${locale}" />\`,
          htmlAttrs: locale === "pt" ? 'lang="pt-BR"' : 'lang="en"',
        }
      }
    `)

    await prerender(fixture)

    const portugueseOutput = await readFile(
      join(fixture.clientDir, "_lang", "pt", "index.html"),
      "utf8",
    )

    expect(portugueseOutput.match(/<title>/g)).toHaveLength(1)
    expect(portugueseOutput).toContain("<title>Voynan pt</title>")
    expect(portugueseOutput).toContain(
      'rel="canonical" href="https://voynan.com/?lang=pt"',
    )
  })
})
