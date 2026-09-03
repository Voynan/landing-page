---
name: git-commit
description: Use when the user explicitly asks Codex to create one or more local Git commits with phrases such as "commit this", "make a commit", "git commit", or "save this to git". Do not use merely because implementation is complete, or for pushes, pull requests, tags, or history rewriting unless the user requests those actions separately.
---

# Git Commit

Create reviewable local commits that preserve user work and follow repository conventions. Keep each commit to one coherent responsibility and write messages in English using Conventional Commits.

## Required sequence

### 1. Inspect without changing Git state

```bash
git status --short
git diff
git diff --staged
git log --oneline -10
```

Never stage first. Understand every modified, staged, and untracked file. Treat pre-existing changes and staging as user-owned; do not unstage, discard, or rewrite them without explicit authorization.

### 2. Plan atomic commits

Group changes so each commit can be reviewed and reverted independently. Keep production code with tests for the same behavior. Separate unrelated features, fixes, refactors, formatting, dependencies, and modules. Use one commit when all changes genuinely form one unit.

### 3. Check safety and evidence

- Scan the diff for secrets, tokens, private keys, credentials, and `.env` contents. Stop if sensitive data could enter history.
- Preserve unrelated user changes.
- Use fresh verification from the current task or run the relevant repository checks.
- Respect failing hooks; never use `--no-verify` to bypass them.

### 4. Stage one group precisely

```bash
git add path/to/file-a path/to/file-b
git add -p path/to/mixed-file
git diff --staged --check
git diff --staged
```

Do not use `git add -A` as a shortcut or first step. It is allowed only after inspecting every path and confirming all changes belong to the same commit. Stop if the staged diff contains unrelated or surprising changes.

### 5. Commit

Use `type(scope): imperative summary`. The scope is optional when no meaningful area exists. Start the summary lowercase and omit the trailing period.

| Type | Purpose |
|---|---|
| `feat`, `fix` | Capability or bug fix |
| `docs`, `style` | Documentation or non-behavioral formatting |
| `refactor`, `perf` | Restructuring or performance |
| `test` | Test-only change |
| `build`, `ci`, `chore` | Build, automation, or maintenance |
| `revert` | Revert an earlier commit |

Add a body only when the reason or trade-off is not evident from the diff. Add issue and breaking-change footers when applicable.

```bash
git commit -m "fix(contact): prevent duplicate submissions" \
  -m "Retries can repeat a successful request, so reuse the submission id."
```

### 6. Handle Codex attribution accurately

Use the user's configured Git author identity. Do not add a `Co-authored-by` trailer for Codex by default: OpenAI publishes no official Codex Git co-author identity for this purpose.

Add an AI trailer only when the user or repository supplies the exact name and email and explicitly requires it. Never invent an OpenAI address or reuse another agent's identity.

### 7. Verify

```bash
git show --stat --oneline HEAD
git status --short
```

Confirm the commit contains only its intended responsibility and the remaining working tree matches expectations. Repeat the sequence for each additional group.

## Stop conditions

- The user did not explicitly authorize a commit. Finishing a task is not authorization.
- The request expands to pushing, opening a pull request, tagging, or publishing without separate authorization.
- The action would amend, rebase, force-push, or rewrite history without an explicit request and known publication state.
- The repository contains secrets, ambiguous grouping, unrelated surprises, or failing verification.
- The operation would discard, overwrite, or silently absorb user changes.
