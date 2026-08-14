# Product

<!-- impeccable:product-schema 1 -->

> Status: product truth inferred from the project documents at the user's direction to proceed. It describes the approved working direction for the landing page, not approval of external claims, assets, links, metrics, testimonials, or legal content.

## Platform

web

## Stack

Documented direction: a bilingual React and TypeScript application built with Bun and Vite, statically rendered for `/pt` and `/en`, then progressively hydrated in the browser. The detailed dependency and responsibility boundaries live in `docs/stack.md` and `docs/v1-todo.md`.

## Users

Documented direction:

- People and organizations evaluating CryptoVault to protect files and verify their integrity.
- Investors and shareholders in Brazil, the United States, and Canada evaluating InvestFusion to organize investment information.
- Brazilian builders and construction companies evaluating Constrully to manage project costs, taxes, and reporting.
- Founders and companies seeking to create, modernize, integrate, automate, operate, or evolve digital products without a minimum project size.
- Developers evaluating Aegis as a straightforward authenticated file-encryption library.

No single persona supersedes these audiences. The landing page gives the three SaaS products equal weight, while product discovery and qualified custom-software conversations remain the two dominant business outcomes.

## Product Purpose

Documented direction: Voynan's first public landing page presents the company as a product studio that creates, launches, operates, and evolves its own digital products and applies that operating experience to client work.

Success is measured in this order:

1. Visitors reach the three SaaS products, with equal emphasis across CryptoVault, InvestFusion, and Constrully.
2. Qualified prospects start a conversation about custom software.
3. Visitors understand Voynan as a product studio capable of handling focused and complex work.
4. Developers can discover Aegis after its public destinations and release facts are confirmed.

## Positioning

Documented direction: Voynan demonstrates capability through products it operates, evidence it can substantiate, and engineering it can explain. The differentiating claim is practical responsibility across launch, operation, maintenance, and evolution—not software delivery in isolation.

The company must not imply that it accepts only large projects. Its voice is technically serious and quietly confident, never dependent on unsupported superlatives or invented proof.

## Operating Context

Documented direction: visitors evaluate Voynan on desktop, tablet, and mobile, in Portuguese or English, and may arrive primarily interested in a product, a custom project, or open-source engineering. They must be able to understand the offer and follow ordinary links before JavaScript hydrates or optional media and motion load.

The public experience ends in external product destinations, approved Aegis destinations, or a short contact flow with a visible e-mail fallback. The internal `/design-system` route exists only to validate implementation quality and is excluded from the release artifact.

## Capabilities and Constraints

Documented direction:

- Public routes are `/pt` and `/en`; the root defaults to Portuguese while preserving an explicit saved preference.
- The page includes navigation, hero, thesis, three equal SaaS chapters, credibility, custom software, Aegis, founder, contact, and footer in that narrative order.
- Primary content, landmarks, headings, links, and calls to action exist in static HTML before hydration.
- Motion, media playback, analytics, and contact submission are independent progressive enhancements with meaningful failure states.
- The contact form collects name, e-mail, and message, validates for usability, never retries submissions automatically, preserves values on failure, and offers manual e-mail copying.
- Analytics accepts only the allowlisted conversion events and never receives form values, copied content, or sensitive financial information visible in product media.
- Aegis remains described as coming soon until its release status, license, environments, example, GitHub URL, and documentation URL are confirmed.
- Authentication, protected routes, OAuth, financial logic, CMS, smooth scrolling, Three.js, WebGL, and a second animation library are outside v1.
- Evidence, claims, external destinations, legal content, and media marked as release blockers must be approved in `docs/v1-content-inventory.md` before a public build.

Open decisions and missing product facts:

- Final company, founder, legal, contact, product, and Aegis destinations.
- Approved metrics, testimonials, permissions, product media, claims, and translations.
- Contact endpoint, message owner, retention policy, antispam provider, and public configuration.
- Production domain/canonical origin, deployment owner, hosting policy, and rollback target.

## Brand Commitments

Documented direction: the name is Voynan and the tagline is “Building Digital Products.” The identity communicates discreet confidence: a serious engineering studio that operates products and contributes to open source.

`docs/voynan-brand-guide.md` is the binding identity reference. The Terafab-inspired reference contributes editorial and cinematic principles only; Voynan must not copy its trademarks, copy, assets, proprietary imagery, or distinctive branded composition.

Final production assets are not yet present in the repository. Asset names listed in the brand guide are evidence of prior direction, not evidence that approved files were received.

## Evidence on Hand

Documented direction available in the repository:

- `docs/voynan-landing-page-guide-en.md`: business priorities, audiences, initial bilingual copy, narrative, behavior, accessibility, resilience, and launch requirements.
- `docs/voynan-brand-guide.md`: brand position, personality, identity rules, and descriptions of assets generated in an earlier session.
- `docs/stack.md` and `docs/structure.md`: technical boundaries and architecture.
- `docs/terafab-inspired-ux-ui-design-system.md`: reference principles subject to the originality constraint.
- `docs/v1-todo.md`: closed v1 scope, milestones, implementation order, and verification gates.
- `docs/v1-content-inventory.md`: current readiness record for content, media, approvals, and missing external facts.

No approved product media, founder portrait, metrics, testimonials, external destinations, contact endpoint, or legal URLs are currently present. Future work must not fabricate them.

## Product Principles

1. Prove capability with real operated products and traceable evidence.
2. Give CryptoVault, InvestFusion, and Constrully equal visual, temporal, and semantic weight.
3. Keep every core narrative and conversion usable without motion, video, analytics, or successful contact submission.
4. Treat Portuguese and English as complete editorial experiences, not fragments or runtime machine translation.
5. Block publication when factual, legal, privacy, or permission evidence is incomplete.

## Accessibility & Inclusion

Documented direction: the release target is WCAG 2.1 AA. The page must support keyboard navigation, visible focus, logical headings and landmarks, a skip link, screen-reader announcements, 200% zoom, and touch targets of at least `44 × 44px`.

`prefers-reduced-motion` removes scrub, long pins, and motion-dependent reveals while preserving the same copy, order, and actions. Mobile uses ordinary document flow for product chapters and never traps scrolling. Contrast is validated against both the brightest and darkest frames of real media.
