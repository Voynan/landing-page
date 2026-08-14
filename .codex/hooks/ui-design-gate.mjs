#!/usr/bin/env node
/**
 * Codex PreToolUse gate for project visual edits.
 *
 * A visual apply_patch is denied until the Impeccable context setup has run in
 * the current session. The gate is deliberately fail-open when Codex input or
 * transcript state is unavailable, and repeated denials downgrade to a warning
 * so a format change cannot trap the agent in a loop.
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
  /(^|\/)(node_modules|dist|build|out|coverage|public|\.git|\.next|\.vercel|\.agents|\.codex|\.impeccable)(\/|$)/
const SKIPPED_FILES = /(\.(?:test|spec)\.|\.d\.ts$)/i
const SUPPORTED_TOOLS = new Set(["apply_patch", "Edit", "Write", "MultiEdit"])
const MAX_DENIALS = 2
const MAX_TRANSCRIPT_BYTES = 32 * 1024 * 1024

// Kept fragmented so reading this hook cannot satisfy its own transcript check.
const IMPECCABLE_SETUP_MARKER = `${"RESOLVED"}_${"CONTEXT"}:`

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

function normalizeProjectPath(rawPath, cwd) {
  const trimmed = String(rawPath || "")
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")

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

function patchTargets(command) {
  if (typeof command !== "string" || !command) return []

  const targets = []
  const header = /^\*\*\* (?:Add|Update|Delete) File:\s*(.+)$/gm
  const move = /^\*\*\* Move to:\s*(.+)$/gm

  for (const match of command.matchAll(header)) targets.push(match[1])
  for (const match of command.matchAll(move)) targets.push(match[1])

  return targets
}

function eventTargets(event, cwd) {
  const input = event?.tool_input
  if (!input || typeof input !== "object") return []

  const candidates = [
    ...patchTargets(input.command),
    input.file_path,
    input.path,
    input.target_file,
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
    // Best effort: failure to persist state must not break a Codex turn.
  }

  return nextCount
}

function denialMessage(visualTargets) {
  const renderedTargets = visualTargets
    .map((target) => `  - ${target}`)
    .join("\n")

  return [
    "Blocked by the project UI design gate.",
    "",
    "This patch changes visual interface files:",
    renderedTargets,
    "",
    "Before retrying:",
    "  1. Invoke the project-local `impeccable` skill.",
    "  2. Complete its context setup and load the playbook for this visual task.",
    "  3. Retry the edit inside the Impeccable workflow.",
    "",
    "Re-running the same patch without setup will be denied again.",
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
      `The UI design gate blocked ${visualTargets.join(", ")} ${MAX_DENIALS} times and is now allowing the edit to avoid a loop. Impeccable setup was not detected; load it before continuing or report that the gate needs repair.`,
    )
  }

  deny(denialMessage(visualTargets))
}

main().catch(() => process.exit(0))
