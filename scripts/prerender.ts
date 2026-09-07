import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

type PublicRoute =
  | "/"
  | "/privacy"
  | "/terms"
  | "/?lang=pt"
  | "/privacy?lang=pt"
  | "/terms?lang=pt"

type RenderedPage = {
  appHtml: string
  headHtml: string
  htmlAttrs: string
}

type ServerRenderModule = {
  render: (url: PublicRoute) => Promise<RenderedPage>
}

export type PrerenderOptions = {
  clientDir?: string
  serverEntry?: string
}

type PublicPage = {
  url: PublicRoute
  outputDirectory: string
}

const publicPages: readonly PublicPage[] = [
  { url: "/", outputDirectory: "." },
  { url: "/privacy", outputDirectory: "privacy" },
  { url: "/terms", outputDirectory: "terms" },
  { url: "/?lang=pt", outputDirectory: "_lang/pt" },
  { url: "/privacy?lang=pt", outputDirectory: "_lang/pt/privacy" },
  { url: "/terms?lang=pt", outputDirectory: "_lang/pt/terms" },
]

// The English root output overwrites the very template this script reads, so a
// pristine copy is stashed beside the client directory to keep reruns stable.
async function readTemplate(clientDir: string) {
  const stashPath = resolve(dirname(clientDir), "prerender-template.html")

  try {
    return await readFile(stashPath, "utf8")
  } catch {
    const template = await readFile(resolve(clientDir, "index.html"), "utf8")

    await mkdir(dirname(stashPath), { recursive: true })
    await writeFile(stashPath, template, "utf8")

    return template
  }
}

function injectRenderedPage(template: string, page: RenderedPage) {
  if (!/<main(?:\s|>)/i.test(page.appHtml)) {
    throw new Error(
      "Prerendered application HTML must contain a <main> landmark.",
    )
  }

  if (!/<html(?:\s[^>]*)?>/i.test(template)) {
    throw new Error("Client template is missing an <html> element.")
  }

  if (!/<\/head>/i.test(template)) {
    throw new Error("Client template is missing a closing </head> tag.")
  }

  const rootElement = /<div\s+id=(["'])root\1\s*><\/div>/i

  if (!rootElement.test(template)) {
    throw new Error(
      'Client template is missing an empty <div id="root"></div>.',
    )
  }

  const htmlAttrs = page.htmlAttrs.trim()
  const localizedTemplate = page.headHtml.includes("<title")
    ? template.replace(/<title(?:\s[^>]*)?>[\s\S]*?<\/title>/i, "")
    : template

  return localizedTemplate
    .replace(/<html(?:\s[^>]*)?>/i, `<html${htmlAttrs ? ` ${htmlAttrs}` : ""}>`)
    .replace(/<\/head>/i, `${page.headHtml}</head>`)
    .replace(rootElement, `<div id="root">${page.appHtml}</div>`)
}

export async function prerender(options: PrerenderOptions = {}) {
  const clientDir = resolve(options.clientDir ?? "dist/client")
  const serverEntry = resolve(
    options.serverEntry ?? "dist/server/entry-server.js",
  )
  const template = await readTemplate(clientDir)
  const serverModule = (await import(
    pathToFileURL(serverEntry).href
  )) as ServerRenderModule

  if (typeof serverModule.render !== "function") {
    throw new TypeError(
      `Server bundle does not export render(): ${serverEntry}`,
    )
  }

  for (const page of publicPages) {
    const rendered = await serverModule.render(page.url)
    const html = injectRenderedPage(template, rendered)
    const outputDirectory = resolve(clientDir, page.outputDirectory)

    await mkdir(outputDirectory, { recursive: true })
    await writeFile(resolve(outputDirectory, "index.html"), html, "utf8")
  }
}

const executedFile = process.argv[1] ? resolve(process.argv[1]) : null

if (executedFile === fileURLToPath(import.meta.url)) {
  await prerender()
}
