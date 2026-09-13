# Voynan Landing Page

The public landing page for [Voynan](https://voynan.com), a product studio that
builds, launches, and operates its own digital products and applies that
experience to client work.

The page is bilingual, prerendered to static HTML, and then progressively
hydrated. Its narrative, copy, accessibility, and resilience requirements are
specified in [`docs/guide.md`](docs/guide.md).

## Stack

React 19 and TypeScript on Vite, built and scripted with [Bun](https://bun.sh).

| Concern           | Choice                                             |
| ----------------- | -------------------------------------------------- |
| Routing           | TanStack Router                                    |
| Forms and data    | TanStack Form, TanStack Query, Zod, axios          |
| Styling           | Tailwind CSS v4, shadcn primitives on Radix        |
| Motion            | GSAP with `@gsap/react`                            |
| Localization      | i18next and react-i18next                          |
| Contact endpoint  | AWS Lambda Function URL, SES, Cloudflare Turnstile |

[`docs/stack.md`](docs/stack.md) records why each dependency is present and what
it is allowed to own. [`docs/structure.md`](docs/structure.md) documents the
directory responsibilities and the enforced dependency direction.

## Getting started

Requires Bun 1.x.

```bash
bun install
cp .env.example .env
bun run dev
```

The dev server runs on the Vite default port. Local work needs no secrets: with
no contact endpoint configured, submission is rejected up front and the form's
visible email alternative stays the usable path.

## Scripts

| Command                    | Purpose                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `bun run dev`              | Vite dev server                                                               |
| `bun run build`            | Validate content, then build the client, the SSR entry, and prerender         |
| `bun run preview`          | Serve the built client                                                        |
| `bun run test`             | Vitest unit and component suites                                              |
| `bun run typecheck`        | `tsc -b` across the app, node, and function projects                          |
| `bun run lint`             | ESLint, zero warnings tolerated                                               |
| `bun run format:check`     | Prettier                                                                      |
| `bun run check`            | Typecheck, lint, format, tests, and the design detector                       |
| `bun run validate:content` | Release gate: required public config plus publishable content in both locales |
| `bun run build:contact`    | Bundle the contact Lambda handler                                             |

Run `bun run check` before opening a pull request.

## Languages and routes

Public routes are English and locale-free: `/`, `/privacy`, and `/terms`.
Language is application state rather than a route segment, so switching
re-renders in place without a reload.

Portuguese is selected with `?lang=pt`. Each Portuguese route is prerendered as
a crawlable variant under `dist/client/_lang/pt/`, and
[`vercel.json`](vercel.json) rewrites the query onto it while marking those
paths `noindex`. A first-time visitor with no saved preference is served the
language their browser asks for, falling back to English.

Both editions are first-class product content. Portuguese and English editorial
copy lives in [`src/content/`](src/content), short interface labels live in
[`src/i18n/locales/`](src/i18n/locales), and a change that makes one edition
true must make the other true as well.

## Content and design references

- [`PRODUCT.md`](PRODUCT.md) — audiences, positioning, capabilities, and the
  constraints a release has to satisfy.
- [`DESIGN.md`](DESIGN.md) — the binding identity: color, typography, spacing,
  and motion tokens.
- [`docs/guide.md`](docs/guide.md) — narrative architecture, section
  specifications, bilingual copy, accessibility, and launch requirements.
- [`docs/terafab-inspired-ux-ui-design-system.md`](docs/terafab-inspired-ux-ui-design-system.md)
  — reference principles only, subject to the originality constraint stated in
  `PRODUCT.md`.

## Contact endpoint

The contact form posts to an AWS Lambda Function URL that verifies a Cloudflare
Turnstile token and sends one email through SES. Its source, deploy steps, and
key rotation notes live in
[`functions/contact/README.md`](functions/contact/README.md).

The function is deployed separately from the site and is intentionally outside
the Vite client graph. It reads `src/schemas/contact.ts` so the form and the
endpoint validate against one contract; the reverse import is forbidden and a
test asserts it.

## Deployment

The site is a static build served from `dist/client`. `vercel.json` supplies the
output directory, the Portuguese rewrites, and the SPA fallback.

`bun run build` runs `validate:content` first, and that gate refuses to build
unless the deploy environment provides:

| Variable                    | Requirement                                  |
| --------------------------- | -------------------------------------------- |
| `VITE_SITE_ORIGIN`          | Set to the canonical origin, apex, no `www`  |
| `VITE_CONTACT_ENDPOINT`     | Set to the deployed contact Function URL     |
| `VITE_ANTISPAM_SITE_KEY`    | Set to the Turnstile site key                |
| `VITE_ENABLE_DESIGN_SYSTEM` | Must be `false`                              |

The same gate asserts that the Portuguese and English content sets are both
publishable. `VITE_ENABLE_DESIGN_SYSTEM` gates the internal `/design-system`
route, which exists only to validate implementation quality and is excluded from
the release artifact.

## Contributing

Project rules are checked into [`.claude/rules/`](.claude/rules) and apply to
every change:

- **English only** — all content tracked by Git is English, except the
  product's own Portuguese copy under `src/content/` and `src/i18n/locales/`.
- **TDD** — new behavior and bug fixes follow red, green, refactor. Unit and
  component tests sit beside their owner as `*.test.ts` or `*.test.tsx`.
- **UI changes** — visual work runs through the project-local `impeccable`
  skill, enforced by a pre-edit gate.

## License

[MIT](LICENSE) © Voynan
