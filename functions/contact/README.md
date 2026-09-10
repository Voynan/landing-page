# Contact endpoint

An AWS Lambda Function URL that verifies a Cloudflare Turnstile token and sends
one email through SES. Design and rationale live in
`docs/superpowers/specs/2026-09-08-contact-endpoint-design.md`.

## Modules

| File | Responsibility |
| --- | --- |
| `request.ts` | Enforces POST and the allowed origin, then validates the body against `src/schemas/contact.ts` |
| `turnstile.ts` | Verifies the token against Cloudflare siteverify, including the hostname |
| `email.ts` | Builds the SES message, stripping control characters from visitor input |
| `handler.ts` | Composes the three and owns configuration and logging |

Imports run one way. This directory reads `src/schemas/contact.ts`; nothing
under `src/` may import from here, and `boundary.test.ts` asserts it.

## Prerequisites

- AWS SAM CLI (`brew install aws-sam-cli`)
- An AWS profile allowed to create IAM roles
- A Turnstile widget for hostname `voynan.com`, created in the Cloudflare
  dashboard. The site key goes in `VITE_ANTISPAM_SITE_KEY`; the secret is a
  deploy parameter here and must never carry a `VITE_` prefix.

## Deploy

    bun run build:contact
    cd functions/contact
    sam build
    sam deploy --region sa-east-1 --capabilities CAPABILITY_IAM

`build:contact` bundles `handler.ts` and everything it imports into
`build/handler.js` with Bun, and `CodeUri` points at that directory. SAM's own
esbuild builder cannot be used here: it copies only `CodeUri` into the build
sandbox, so the shared schema in `src/` is unreachable, and pointing `CodeUri`
at the repository root instead would copy 554 MB on every build.

The bundle must be rebuilt before every deploy. `sam build` will happily package
a stale `build/handler.js`.

Parameters are stored in `samconfig.toml`, which is git-ignored because it holds
the Turnstile secret and the recipient addresses. On a fresh machine, run
`sam deploy --guided` and supply them again.

Do not pass `--parameter-overrides` on the command line for `ContactRecipients`.
The shorthand splits on spaces and treats a comma as a list separator, so an
escaped comma survives into the value as a literal backslash and produces an
invalid recipient. Quote the value inside `samconfig.toml` instead, as it is
already written there.

## Parameters

| Parameter | Value |
| --- | --- |
| `TurnstileSecret` | Cloudflare dashboard, Turnstile widget, secret key |
| `ContactFromAddress` | `contact@voynan.com` |
| `ContactRecipients` | the fixed recipient list |
| `AllowedOrigin` | `https://voynan.com` |
| `SesIdentityName` | `voynan.com` |

The `ContactEndpoint` output is the value for `VITE_CONTACT_ENDPOINT`.

## Verifying a deploy

Both of these must answer `403`, and neither may deliver an email:

    curl -s -o /dev/null -w "%{http_code}\n" -X POST "$CONTACT_ENDPOINT" \
      -H 'content-type: application/json' \
      -H 'origin: https://attacker.example' \
      -d '{"name":"a","email":"a@example.org","message":"a","antispamToken":"a"}'

    curl -s -o /dev/null -w "%{http_code}\n" -X POST "$CONTACT_ENDPOINT" \
      -H 'content-type: application/json' \
      -H 'origin: https://voynan.com' \
      -d '{"name":"a","email":"a@example.org","message":"a","antispamToken":"invalid"}'

A `200` on either one is a defect: the endpoint accepted a request it should
have refused.

These prove the rejection paths only. They cannot prove the Turnstile secret is
correct, because an invalid token and a wrong secret both produce `403`. The
secret is only proven by a real submission from the live site, where a genuine
token must be accepted.

## Concurrency

`ReservedConcurrentExecutions` is absent from the template. This account's total
Lambda concurrency limit is 10, the new-account default, and AWS refuses any
reservation that leaves fewer than 10 unreserved. That account limit is a
tighter cap than the 5 this function wanted, and this is the only Lambda in the
account, so the blast radius is bounded either way. Restore
`ReservedConcurrentExecutions: 5` once the account limit is raised, or the cap
disappears along with it.

## Rotating the Turnstile secret

Generate a new secret in the Cloudflare dashboard, then redeploy with the new
`TurnstileSecret`. The site key does not change, so no frontend deploy is
needed.

## Local development

The browser never calls this endpoint during development. `bun dev` and the
test suites use the MSW handlers in `src/mocks/contactHandlers.ts`, which is
why `AllowedOrigin` holds a single production value.
