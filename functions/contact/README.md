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

    cd functions/contact
    sam build
    sam deploy --region sa-east-1 --capabilities CAPABILITY_IAM

The first deploy uses `--guided` and asks for every parameter. Parameters are
then stored in `samconfig.toml`, which is git-ignored because it holds the AWS
account id and the recipient addresses. On a fresh machine, run
`sam deploy --guided` and supply them again.

If esbuild refuses to follow `../../src/schemas/contact` outside `CodeUri`, set
`CodeUri: ../..` and `EntryPoints: [functions/contact/handler.ts]` in
`template.yaml`, leaving everything else unchanged.

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

A `200` on the second means the Turnstile secret is wrong. Fix it before
announcing the form.

## Rotating the Turnstile secret

Generate a new secret in the Cloudflare dashboard, then redeploy with the new
`TurnstileSecret`. The site key does not change, so no frontend deploy is
needed.

## Local development

The browser never calls this endpoint during development. `bun dev` and the
test suites use the MSW handlers in `src/mocks/contactHandlers.ts`, which is
why `AllowedOrigin` holds a single production value.
