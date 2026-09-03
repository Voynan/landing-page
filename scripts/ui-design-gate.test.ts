import { randomUUID } from "node:crypto"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { spawnSync } from "node:child_process"

import { afterEach, describe, expect, it } from "vitest"

const gateScript = resolve(process.cwd(), ".claude/hooks/ui-design-gate.mjs")
const temporaryDirectories: string[] = []

// Assembled from fragments so this file cannot satisfy the gate it exercises:
// the literal marker must never appear in a transcript just because a session
// read the test suite.
const resolvedContextMarker = ["RESOLVED", "CONTEXT:"].join("_")

type GateEventOverrides = {
  toolName?: string
  toolInput?: Record<string, unknown>
  sessionId?: string
  transcriptPath?: string | null
}

async function createFixture(transcript = "ordinary session") {
  const projectRoot = await mkdtemp(join(tmpdir(), "voynan-ui-gate-"))
  const transcriptPath = join(projectRoot, "transcript.jsonl")

  temporaryDirectories.push(projectRoot)
  await writeFile(transcriptPath, transcript, "utf8")

  return { projectRoot, transcriptPath }
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
      tool_name: overrides.toolName ?? "Edit",
      tool_input: overrides.toolInput ?? {
        file_path: "src/components/Card.tsx",
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

function denialReason(result: ReturnType<typeof runGate>) {
  return result.payload?.hookSpecificOutput?.permissionDecisionReason ?? ""
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

describe("UI design gate", () => {
  it("blocks an edit to a UI component before the design context is resolved", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath)

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.payload?.hookSpecificOutput).toMatchObject({
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
    })
    expect(denialReason(result)).toContain("src/components/Card.tsx")
  })

  it("allows the same edit once the transcript carries the resolved design context", async () => {
    const fixture = await createFixture(
      `tool output\n${resolvedContextMarker}\n`,
    )
    const result = runGate(fixture.projectRoot, fixture.transcriptPath)

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("keeps blocking when the transcript only mentions the design skill's files", async () => {
    const fixture = await createFixture(
      [
        ".claude/skills/impeccable/SKILL.md",
        ".claude/skills/impeccable/scripts/context.mjs",
        `name: ${"impeccable"}`,
      ].join("\n"),
    )
    const result = runGate(fixture.projectRoot, fixture.transcriptPath)

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
  })

  it("blocks a write to a stylesheet wherever it lives", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolName: "Write",
      toolInput: { file_path: "src/features/marketing/hero.css" },
    })

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
    expect(denialReason(result)).toContain("src/features/marketing/hero.css")
  })

  it("does not gate non-visual files", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolInput: { file_path: "src/utils/formatDate.ts" },
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("does not gate component test files", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolInput: { file_path: "src/components/Card.test.tsx" },
    })

    expect(result.stdout).toBe("")
  })

  it("blocks a shell command that redirects into a UI file", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolName: "Bash",
      toolInput: {
        command: "cat > src/styles/globals.css <<'EOF'\n:root {\n}\nEOF",
      },
    })

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
    expect(denialReason(result)).toContain("src/styles/globals.css")
  })

  it("blocks a shell command that edits a UI file in place", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolName: "Bash",
      toolInput: {
        command: "sed -i '' 's/gap-4/gap-6/' src/components/landing/Hero.tsx",
      },
    })

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
    expect(denialReason(result)).toContain("src/components/landing/Hero.tsx")
  })

  it("lets a shell command read a UI file", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolName: "Bash",
      toolInput: {
        command:
          "sed -n '1,40p' src/components/landing/Hero.tsx | grep -n className > /dev/null",
      },
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).toBe("")
  })

  it("names every visual target of a compound shell command", async () => {
    const fixture = await createFixture()
    const result = runGate(fixture.projectRoot, fixture.transcriptPath, {
      toolName: "Bash",
      toolInput: {
        command:
          "printf 'x' > src/components/Card.tsx && printf 'y' >> src/styles/tokens.css",
      },
    })

    const reason = denialReason(result)

    expect(result.payload?.hookSpecificOutput.permissionDecision).toBe("deny")
    expect(reason).toContain("src/components/Card.tsx")
    expect(reason).toContain("src/styles/tokens.css")
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
    const input = { sessionId: randomUUID() }

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
