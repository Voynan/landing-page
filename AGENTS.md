# Project instructions

This project is driven with Claude Code. The instructions live in
[`.claude/rules/`](.claude/rules/) and are loaded automatically for every
session:

- [`ui-changes.md`](.claude/rules/ui-changes.md) — visual UI work runs through
  the project-local `impeccable` skill, enforced by a `PreToolUse` gate.
- [`english-only.md`](.claude/rules/english-only.md) — English is the only
  language permitted in content tracked by Git.
- [`tdd-and-testing.md`](.claude/rules/tdd-and-testing.md) — TDD workflow, tool
  boundaries, and test design.

Any agent that reads this file instead should read those rules and follow them.
