#!/usr/bin/env node
/**
 * PreToolUse gate for visual edits, enforcing `.claude/rules/ui-changes.md`.
 *
 * A visual edit is denied until the Impeccable context setup has run in the
 * current session. The gate covers the file tools and the shell, because a
 * heredoc or an in-place `sed` changes a component exactly as much as `Edit`
 * does.
 *
 * Contract: never break a turn. Malformed input, an unreadable transcript, or
 * any internal error allows the tool through (exit 0). The gate fails open.
 *
 * Escape hatches:
 *   - UI_DESIGN_GATE_DISABLED=1 turns the gate off for the shell or session.
 *   - After MAX_DENIALS blocks on the same targets in one session, the gate
 *     downgrades to a warning so a detection miss cannot become a loop.
 */

import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const STYLE_EXTENSIONS = new Set([
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".pcss",
  ".styl",
])
const MARKUP_EXTENSIONS = new Set([".tsx", ".jsx", ".vue", ".svelte", ".astro"])
const UI_DIRECTORIES = new Set([
  "app",
  "components",
  "forms",
  "layout",
  "layouts",
  "pages",
  "routes",
  "screens",
  "styles",
  "theme",
  "ui",
  "views",
])
const SKIPPED_DIRECTORIES =
  /(^|\/)(node_modules|dist|build|out|coverage|public|playwright-report|test-results|\.git|\.next|\.vercel|\.claude|\.impeccable)(\/|$)/
const SKIPPED_FILES = /(\.(?:test|spec|stories)\.|\.d\.ts$)/i
const SUPPORTED_TOOLS = new Set([
  "Bash",
  "Edit",
  "MultiEdit",
  "NotebookEdit",
  "Write",
])
const MAX_DENIALS = 2
const MAX_TRANSCRIPT_BYTES = 32 * 1024 * 1024

// Kept fragmented so reading this hook cannot satisfy its own transcript check.
const IMPECCABLE_SETUP_MARKER = `${"RESOLVED"}_${"CONTEXT"}:`

// Shell constructs that write a file. Reads are deliberately left alone.
const REDIRECT_TARGET = /(?:^|[^0-9&<>])>>?\s*(?!&)(["']?)([^\s"';|&<>()]+)\1/g
const TEE_TARGET = /\btee\b(?:\s+-\S+)*\s+(["']?)([^\s"';|&<>()]+)\1/g
const IN_PLACE_EDITOR = /(?:^|\s)(?:sed|perl)\s/
const IN_PLACE_FLAG = /\s-i(?:\s|["']|\.|=|$)/
const COPYING_COMMAND = /(?:^|\s)(?:cp|mv|install|rsync)\s/
const SHELL_SEPARATORS = /\n|;|\|\||&&|\||&/

async function readStdin() {
  if (process.stdin.isTTY) return ""

  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)

  return Buffer.concat(chunks).toString("utf8")
}

function allow(additionalContext) {
  if (additionalContext) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext,
        },
      }),
    )
  }

  process.exit(0)
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  )
  process.exit(0)
}

function truthy(value) {
  return (
    value !== undefined && value !== "" && value !== "0" && value !== "false"
  )
}

function unquote(value) {
  return String(value || "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
}

function normalizeProjectPath(rawPath, cwd) {
  const trimmed = unquote(rawPath)

  if (!trimmed) return ""

  const absolutePath = path.isAbsolute(trimmed)
    ? trimmed
    : path.resolve(cwd, trimmed)
  const relativePath = path.relative(cwd, absolutePath)

  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return ""
  }

  return relativePath.split(path.sep).join("/")
}

function argumentsOf(segment) {
  return segment
    .trim()
    .split(/\s+/)
    .map(unquote)
    .filter((token) => token && !token.startsWith("-"))
}

function shellTargets(command) {
  if (typeof command !== "string" || !command) return []

  const targets = []

  for (const match of command.matchAll(REDIRECT_TARGET)) targets.push(match[2])
  for (const match of command.matchAll(TEE_TARGET)) targets.push(match[2])

  for (const segment of command.split(SHELL_SEPARATORS)) {
    if (IN_PLACE_EDITOR.test(segment) && IN_PLACE_FLAG.test(segment)) {
      targets.push(...argumentsOf(segment))
    }

    if (COPYING_COMMAND.test(segment)) {
      const operands = argumentsOf(segment)
      if (operands.length > 1) targets.push(operands[operands.length - 1])
    }
  }

  return targets
}

function eventTargets(event, cwd) {
  const input = event?.tool_input
  if (!input || typeof input !== "object") return []

  const candidates = [
    ...shellTargets(input.command),
    input.file_path,
    input.path,
    input.target_file,
    input.notebook_path,
  ]

  return Array.from(
    new Set(
      candidates
        .filter((candidate) => typeof candidate === "string")
        .map((candidate) => normalizeProjectPath(candidate, cwd))
        .filter(Boolean),
    ),
  )
}

function isVisualFile(relativePath) {
  if (
    SKIPPED_DIRECTORIES.test(relativePath) ||
    SKIPPED_FILES.test(relativePath)
  ) {
    return false
  }

  const extension = path.extname(relativePath).toLowerCase()
  if (STYLE_EXTENSIONS.has(extension) || extension === ".html") return true
  if (!MARKUP_EXTENSIONS.has(extension)) return false

  return relativePath
    .split("/")
    .slice(0, -1)
    .some((segment) => UI_DIRECTORIES.has(segment.toLowerCase()))
}

function readTranscriptTail(transcriptPath) {
  const stat = fs.statSync(transcriptPath)
  if (!stat.isFile()) return null

  if (stat.size <= MAX_TRANSCRIPT_BYTES) {
    return fs.readFileSync(transcriptPath, "utf8")
  }

  const fileDescriptor = fs.openSync(transcriptPath, "r")

  try {
    const buffer = Buffer.alloc(MAX_TRANSCRIPT_BYTES)
    fs.readSync(
      fileDescriptor,
      buffer,
      0,
      MAX_TRANSCRIPT_BYTES,
      stat.size - MAX_TRANSCRIPT_BYTES,
    )
    return buffer.toString("utf8")
  } finally {
    fs.closeSync(fileDescriptor)
  }
}

function impeccableSetupCompleted(transcriptPath) {
  if (!transcriptPath) return null

  try {
    const transcript = readTranscriptTail(transcriptPath)
    return transcript === null
      ? null
      : transcript.includes(IMPECCABLE_SETUP_MARKER)
  } catch {
    return null
  }
}

function stateFilePath(sessionId) {
  const safeSessionId = String(sessionId || "unknown")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 100)

  return path.join(os.tmpdir(), `voynan-ui-design-gate-${safeSessionId}.json`)
}

function bumpDenials(sessionId, targetKey) {
  const statePath = stateFilePath(sessionId)
  let state = {}

  try {
    state = JSON.parse(fs.readFileSync(statePath, "utf8")) || {}
  } catch {
    state = {}
  }

  const nextCount = (Number(state[targetKey]) || 0) + 1
  state[targetKey] = nextCount

  try {
    fs.writeFileSync(statePath, JSON.stringify(state))
  } catch {
    // Best effort: failure to persist state must not break a turn.
  }

  return nextCount
}

function denialMessage(visualTargets) {
  const renderedTargets = visualTargets
    .map((target) => `  - ${target}`)
    .join("\n")

  return [
    "Blocked by .claude/rules/ui-changes.md.",
    "",
    "This change touches visual interface files:",
    renderedTargets,
    "",
    "Before retrying:",
    "  1. Invoke the `impeccable` skill.",
    "  2. Run its Setup step once, targeting the file or surface being changed,",
    "     then load the playbook the skill selects for this task.",
    "  3. Retry the edit inside that workflow.",
    "",
    "This is not a permission prompt: repeating the same call without the setup",
    "will be denied again.",
  ].join("\n")
}

async function main() {
  if (truthy(process.env.UI_DESIGN_GATE_DISABLED)) allow()

  let event

  try {
    const rawInput = await readStdin()
    event = rawInput ? JSON.parse(rawInput) : null
  } catch {
    allow()
  }

  if (!event || typeof event !== "object") allow()
  if (!SUPPORTED_TOOLS.has(event.tool_name)) allow()

  const cwd =
    typeof event.cwd === "string" && event.cwd ? event.cwd : process.cwd()
  const visualTargets = eventTargets(event, cwd).filter(isVisualFile)

  if (visualTargets.length === 0) allow()

  const setupCompleted = impeccableSetupCompleted(event.transcript_path)
  if (setupCompleted === null || setupCompleted) allow()

  const targetKey = visualTargets.slice().sort().join("|")
  const denialCount = bumpDenials(event.session_id, targetKey)

  if (denialCount > MAX_DENIALS) {
    allow(
      `The UI design gate blocked ${visualTargets.join(", ")} ${MAX_DENIALS} times and is now allowing the edit to avoid a loop. The Impeccable setup was not detected; run it before continuing, or report that the gate needs repair.`,
    )
  }

  deny(denialMessage(visualTargets))
}

main().catch(() => process.exit(0))
