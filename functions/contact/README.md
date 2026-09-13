# Contact endpoint

An AWS Lambda Function URL that verifies a Cloudflare Turnstile token and sends
one email through SES.

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

There is no `package.json` in this directory, deliberately. Dependencies are
resolved from the repository root at bundle time, and a second manifest here
would be read by nothing while being free to drift from the first.

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
| `SesConfigurationSetName` | the identity's default configuration set |

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

## What the IAM policy does and does not guarantee

The execution role allows `ses:SendEmail` only on the `voynan.com` identity, so
the function cannot send as any other domain. That part is real.

It does **not** enforce the recipient list. Two condition keys were tried and
both had to be removed, for different reasons.

`ses:FromAddress` is not populated by the v2 `SendEmail` call. `StringEquals`
over an absent key denies outright, so that condition rejected every message
with `AccessDeniedException`.

`ses:Recipients` *is* populated, but with more than the `To` list: the
visitor's `Reply-To` address appears in it. That address is different on every
submission and cannot be listed in advance, so `ForAllValues:StringEquals`
denied every legitimate send. Reproduce it against the live role:

    aws iam simulate-principal-policy --policy-source-arn <role-arn> \
      --action-names ses:SendEmail --resource-arns <identity-arn> \
      --context-entries file://context.json

With `ses:Recipients` holding only the two configured addresses it answers
`allowed`; add any third address and it answers `implicitDeny`.

The recipients are therefore guaranteed by the handler alone: they come from
configuration, are validated as addresses at startup, and are never read from
the request body. No IAM condition can express "these two in `To`, anybody in
`Reply-To`", so this is a limit of the mechanism rather than a shortcut.

## The configuration set is part of the permission

The `voynan.com` identity carries a default configuration set, and a default
applies to every message sent from that identity. SES therefore authorizes
`ses:SendEmail` against the identity **and** the configuration set, even though
`handler.ts` never names one. Granting the identity alone answered
`AccessDeniedException` on every send, which the handler caught and reported as
a `502` to the browser.

Both ARNs are listed in `Resource`, and `SesConfigurationSetName` is the
parameter that carries the name. Read the live value before changing it:

    aws sesv2 get-email-identity --region sa-east-1 \
      --email-identity voynan.com --query ConfigurationSetName

If someone attaches a different default configuration set in the console, that
parameter has to follow or every send starts failing again with the same
`AccessDeniedException`.

`aws iam simulate-principal-policy` cannot confirm this half of the policy. It
answers `implicitDeny` for the configuration-set ARN even when the deployed
policy allows it, because it does not recognize `configuration-set` as a
resource type for `ses:SendEmail`. Use it for the identity, and prove the
configuration set with a real send.

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
