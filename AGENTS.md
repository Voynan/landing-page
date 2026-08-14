# Project instructions

## Visual UI work

Before modifying any user-facing visual interface, invoke the project-local
`impeccable` skill and complete its setup for the current session.

This requirement applies to components, pages, layouts, routes that render UI,
forms, views, screens, HTML templates, stylesheets, themes, design tokens, and
other visual markup. It applies even when the requested change looks small or
purely mechanical. Tests and type declarations are excluded unless their
change also alters a rendered specimen.

For each session that includes visual UI work:

1. Read `.agents/skills/impeccable/SKILL.md` completely.
2. Run its context setup once from the project root, targeting the surface or
   source file being changed.
3. Load the playbook selected by the skill and, immediately before editing UI,
   its craft-floor reference.
4. Do not make the first visual edit until those setup steps are complete.
5. Keep the existing Impeccable post-edit detector and final deep pass enabled.

If the design hook blocks an edit, do not retry it unchanged. Complete the
Impeccable setup first, then retry the edit inside that workflow.
