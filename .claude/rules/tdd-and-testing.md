# TDD and testing

[`docs/stack.md`](../../docs/stack.md) is the source of truth for test tooling. Use Vitest, Testing Library, MSW, and Playwright for the responsibilities below; do not introduce another test runner, DOM-testing library, or HTTP-mocking tool without updating the stack decision first.

## TDD workflow

All new behavior and bug fixes follow red → green → refactor. Use the `superpowers:test-driven-development` skill before writing implementation code.

1. Write the smallest test that describes the next observable behavior.
2. Run it and confirm that it fails for the expected reason. A syntax, setup, or unrelated failure is not a valid red state.
3. Write only enough production code to make the test pass.
4. Run the relevant test again, then refactor while keeping the suite green.

Every bug fix starts with a regression test that reproduces the defect at the lowest appropriate layer. Do not delete, skip, weaken, or rewrite a valid failing test merely to make the suite pass; change it only when the documented requirement has changed.

## Tool boundaries

| Tool                         | Responsibility                                                                                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest**                   | Unit-test TypeScript logic such as content contracts, schemas, locale and routing helpers, analytics contracts, state, and fallback utilities.                                                           |
| **Vitest + Testing Library** | Test React components through rendered, user-observable behavior: semantic content, controls, keyboard interaction, form states, accessible announcements, and static or reduced-motion fallbacks.       |
| **MSW**                      | Exercise contact-service HTTP behavior at the network boundary, including success, server errors, timeouts, and malformed responses. Prefer MSW handlers over mocking axios or TanStack Query internals. |
| **Playwright**               | Test complete browser journeys across `/pt` and `/en`, responsive layouts, navigation, hydration, reduced motion, media failures, contact failures, and analytics privacy boundaries.                    |

Use the lowest layer that proves the behavior. Do not move pure logic into Playwright, and do not duplicate every component edge case in end-to-end tests. Cross-layer coverage is appropriate only for critical journeys or integration boundaries.

## Test design

- Name each test after the behavior and outcome it verifies. The `describe`/`it` or `test` title replaces the Python-style docstring requirement; comments should explain only non-obvious rationale.

  ```tsx
  describe("ContactForm", () => {
    it("retains the submitted values and exposes the email fallback when the request fails", async () => {
      // Arrange, act, and assert through the rendered UI.
    })
  })
  ```

- Assert public behavior, not component state, hook internals, implementation-specific class names, or call order unless that order is itself a contract.
- In component tests, prefer queries by role and accessible name, label, or visible text. Use test IDs only when the UI has no meaningful semantic selector.
- Keep tests deterministic and independent. Reset mutable handlers, mocks, timers, and shared state between tests; never depend on execution order or real production services.
- Use explicit assertions instead of broad page or component snapshots. A focused snapshot is acceptable only when the serialized structure is the behavior under test.
- In Playwright, wait on locators, navigation, responses, or assertions rather than fixed sleeps. Each journey must create or intercept its own required state.
- Cover both success and meaningful failure paths. For motion or media work, verify that the same essential copy, order, and actions remain available in reduced-motion and failure states.

## Placement and verification

- Keep unit and component tests beside their owner as `*.test.ts` or `*.test.tsx`; keep browser journeys under `e2e/`.
- Run tests through the Bun-backed scripts declared in `package.json`.
- During development, run the narrow failing test first. Before completion, run the relevant full Vitest and/or Playwright suite and report the exact command and result.
- A change is not complete while relevant tests are skipped, flaky, or failing.
