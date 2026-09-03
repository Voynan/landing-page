# Visual UI work

Before modifying any user-facing visual interface, invoke the project-local
`impeccable` skill and complete its setup for the current session.

This requirement applies to components, pages, layouts, routes that render UI,
forms, views, screens, HTML templates, stylesheets, themes, design tokens, and
other visual markup. It applies even when the requested change looks small or
purely mechanical. Tests and type declarations are excluded unless the change
also alters a rendered specimen.

For each session that includes visual UI work:

1. Read `.claude/skills/impeccable/SKILL.md` completely.
2. Run its context setup once from the project root, targeting the surface or
   source file being changed.
3. Load the playbook the skill selects, and its craft-floor reference
   immediately before editing UI.
4. Do not make the first visual edit until those setup steps are complete.
5. Keep the Impeccable post-edit detector and final deep pass enabled.

## The gate

`.claude/hooks/ui-design-gate.mjs` runs as a `PreToolUse` hook and denies visual
edits until the setup output for the current session shows that the design
context was resolved. It covers `Edit`, `Write`, `MultiEdit`, `NotebookEdit`,
and the shell: a heredoc redirect, an in-place `sed`, or a copy that lands on a
visual file is gated exactly like a file-tool edit. Reading those files is never
gated.

The gate fails open by design. Unreadable hook input, a missing transcript, or
any internal error allows the tool through, and after two denials for the same
targets in one session it downgrades to a warning so a detection miss cannot
trap the session. `UI_DESIGN_GATE_DISABLED=1` turns it off for a shell or
session.

If the gate blocks an edit, do not retry it unchanged. Complete the Impeccable
setup first, then retry the edit inside that workflow.
