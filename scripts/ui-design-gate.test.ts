import { randomUUID } from "node:crypto"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { spawnSync } from "node:child_process"

import { afterEach, describe, expect, it } from "vitest"

const gateScript = resolve(process.cwd(), ".codex/hooks/ui-design-gate.mjs")
const temporaryDirectories: string[] = []

type GateEventOverrides = {
  command?: string
  sessionId?: string
  transcriptPath?: string | null
}

async function createFixture(transcript = "ordinary Codex session") {
  const projectRoot = await mkdtemp(join(tmpdir(), "voynan-ui-gate-"))
  const transcriptPath = join(projectRoot, "transcript.jsonl")

  temporaryDirectories.push(projectRoot)
  await writeFile(transcriptPath, transcript, "utf8")

  return { projectRoot, transcriptPath }
}

function patchFor(...paths: string[]) {
  return [
    "*** Begin Patch",
    ...paths.flatMap((filePath) => [
      `*** Update File: ${filePath}`,
      "@@",
      "-before",
      "+after",
    ]),
    "*** End Patch",
  ].join("\n")
}

function runGate(
  projectRoot: string,
  defaultTranscriptPath: string,
  overrides: GateEventOverrides = {},
) {
  const result = spawnSync(process.execPath, [gateScript], {
    cwd: projectRoot,
    encoding: "utf8",
    env: { ...process.env, UI_DESIGN_GATE_DISABLED: "0" },
    input: JSON.stringify({
      cwd: projectRoot,
      hook_event_name: "PreToolUse",
      session_id: overrides.sessionId ?? randomUUID(),
      tool_name: "apply_patch",
      tool_input: {
        command: overrides.command ?? patchFor("src/components/Card.tsx"),
      },
      transcript_path:
        overrides.transcriptPath === undefined
          ? defaultTranscriptPath
          : overrides.transcriptPath,
    }),
  })

  return {
    status: result.status,
    stderr: result.stderr,
    stdout: result.stdout,
    payload: result.stdout ? JSON.parse(result.stdout) : null,
  }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

describe("Codex UI design gate", () => {
  it("blocks a canonical apply_patch call that changes a UI component before setup", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath)

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.payload?.hookSpecificOutput).toMatchObject({
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
    })
    expect(
      result.payload?.hookSpecificOutput.permissionDecisionReason,
    ).toContain("src/components/Card.tsx")
  })

  it("allows UI edits after the Impeccable session setup completed", async () => {
    const setupMarker = ["RESOLVED", "CONTEXT:"].join("_")
    const fixture = await createFixture(`tool output\n${setupMarker}\n`)
    const result = runGate(fixture.projectRoot, fixture.transcriptPath)

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("finds every visual target in a multi-file patch", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      command: patchFor("README.md", "src/features/marketing/hero.css"),
    })

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
    expect(
      result.payload?.hookSpecificOutput.permissionDecisionReason,
    ).toContain("src/features/marketing/hero.css")
  })

  it("does not gate non-visual files", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      command: patchFor("docs/architecture.md", "src/utils/formatDate.ts"),
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("fails open when the transcript is unavailable", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      transcriptPath: null,
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("downgrades repeated denials so a detection miss cannot trap the session", async () => {
    const fixture = await createFixture()
    const sessionId = randomUUID()
    const input = { sessionId }

    expect(
      runGate(fixture.projectRoot, fixture.transcriptPath, input).payload
        ?.hookSpecificOutput.permissionDecision,
    ).toBe("deny")
    expect(
      runGate(fixture.projectRoot, fixture.transcriptPath, input).payload
        ?.hookSpecificOutput.permissionDecision,
    ).toBe("deny")

    const thirdAttempt = runGate(
      fixture.projectRoot,
      fixture.transcriptPath,
      input,
    )

    expect(
      thirdAttempt.payload?.hookSpecificOutput.permissionDecision,
    ).toBeUndefined()
    expect(thirdAttempt.payload?.hookSpecificOutput.additionalContext).toMatch(
      /allowing.*avoid a loop/i,
    )
  })
})
