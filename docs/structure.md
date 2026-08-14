<!-- v2.0.0 | last changed 2026-08-13 -->

# Voynan Landing Page — Project Structure

All application code lives under `src/`. The structure separates semantic content, accessible controls, narrative composition, motion orchestration, and external effects so each part can be understood and tested without running the complete cinematic page.

This is a target structure, not evidence that every listed file already exists. Add a file when its responsibility is implemented; do not create empty architecture for hypothetical features.

```text
src/
├── assets/
│   ├── fonts/                 # Poppins and JetBrains Mono files
│   ├── images/                # Product stills, portrait, and approved logos
│   ├── posters/               # Required fallback poster for each video
│   ├── svg/                   # Voynan marks and optimized eclipse geometry
│   └── video/                 # Art-directed desktop and mobile encodes
├── components/
│   ├── landing/               # Voynan-specific narrative components
│   │   ├── aegis/
│   │   ├── contact/
│   │   ├── credibility/
│   │   ├── footer/
│   │   ├── founder/
│   │   ├── hero/
│   │   ├── navigation/
│   │   ├── products/
│   │   ├── services/
│   │   └── thesis/
│   ├── media/                 # Resilient image, video, poster, and code renderers
│   ├── motion/                # Shared eclipse and GSAP orchestration primitives
│   ├── seo/                   # Canonical, hreflang, and social metadata
│   └── ui/                    # Small set of accessible shadcn/Radix primitives
├── config/                    # Validated public environment and site constants
├── content/
│   ├── en/                    # English editorial adaptation
│   ├── pt/                    # Portuguese source content
│   ├── contracts.ts           # Shared content types and publication states
│   └── index.ts               # Locale-aware content resolver
├── contexts/                  # Narrow React providers when subtree scope is correct
├── forms/                     # Contact fields, schema integration, and error summary
├── hooks/                     # Shared React behavior without presentation
├── i18n/
│   ├── locales/
│   │   ├── en/                # Short UI, status, validation, and metadata labels
│   │   └── pt/
│   └── index.ts               # react-i18next initialization and persistence
├── lib/                       # Third-party setup and side-effect adapters
│   ├── analytics.ts
│   ├── apiClient.ts
│   ├── gsap.ts
│   └── queryClient.ts
├── mocks/                     # MSW contact handlers and fixtures
├── pages/                     # Locale landing page and route-level fallbacks
├── routes/                    # Typed locale routes and chapter-aware language links
├── schemas/                   # Zod schemas for contact, config, and content validation
├── services/                  # Contact submission and antispam boundaries
├── store/                     # Optional cross-section UI state only
├── styles/
│   ├── globals.css            # Reset, base semantics, focus, and fallback styling
│   └── tokens.css             # Voynan color, type, grid, spacing, and motion tokens
├── types/                     # Shared TypeScript types not owned by another module
├── utils/                     # Pure locale, anchor, clipboard, and media helpers
├── entry-client.tsx           # Hydration entry
└── entry-server.tsx           # Static rendering entry for `/pt` and `/en`
```

Tests stay close to their owner as `*.test.ts` or `*.test.tsx`. Browser journeys live under the root `e2e/` directory, and static-build checks live under `scripts/` only when they cannot be expressed as application tests.

---

## Dependency Direction

```text
routes/pages
    ↓
components/landing
    ↓
components/{media,motion,seo,ui} + forms + hooks
    ↓
content + services + store
    ↓
config + schemas + lib + types + utils
```

Dependencies point downward. `content/` never imports React. `components/ui/` never imports a landing chapter. Motion may enhance a rendered section, but semantic content must not depend on a timeline reaching a particular progress value.

---

## Directory Responsibilities

### `assets/`

Contains production-ready media rather than invented interface mockups. Every product video has a poster, explicit dimensions, descriptive alternative text in `content/`, and a mobile-specific encode or crop. Product colors stay inside product media; Voynan's surrounding interface uses navy, ivory, and copper.

Keep SVGs optimized and inspectable. The eclipse geometry must use few paths and avoid expensive filters. Fonts include only the required Poppins and JetBrains Mono weights and are preloaded selectively.

### `components/landing/`

Owns the page's original visual composition. Components receive locale-specific content as props; they do not fetch copy or embed translations inline. Every top-level section renders useful HTML before motion attaches and exposes a stable section id shared by both languages.

The expected composition follows the guide:

```text
LandingShell
├── ProgressiveNav
│   ├── RetractableVoynanMark
│   ├── NavLinks
│   └── LanguageSwitch
├── ProductStudioHero
│   ├── EclipseThread
│   ├── ProductMediaFragments
│   └── CTAGroup
├── StudioThesis
├── SaaSStoryStage
│   ├── ProductChapter × 3
│   ├── ProductMedia
│   └── ProgressOrbit
├── CredibilityField
│   ├── VerifiedMetric
│   └── Testimonial
├── BuildWithUsFlow
│   └── CapabilityLayer × 4
├── AegisOpenSourceChapter
│   ├── RealCodeSample
│   └── TechnicalLinks
├── FounderNote
├── ContactSection
│   ├── EssentialContactForm
│   ├── CopyEmailAction
│   └── LinkedInAction
└── AtmosphericFooter
```

The products stage preserves equal timing, scale, and CTA weight for CryptoVault, InvestFusion, and Constrully. It is pinned only at desktop breakpoints. Mobile renders the same three chapters in normal document order.

Do not create a generic `SectionCard` or force all chapters through one configurable mega-component. Reuse small structural primitives when their semantics match; preserve individual chapter composition where the narrative differs.

### `components/ui/`

Contains a deliberately small set of accessible controls. Use native elements when they already provide the required behavior. Use shadcn/Radix for interaction patterns that benefit from established keyboard navigation, focus management, or accessible state.

Voynan owns the copied source. Restyle it to the brand rather than retaining shadcn's default card-heavy appearance. Controls use the guide's small radii, persistent labels, visible focus, and minimum `44 × 44px` mobile target. No component may communicate state through color alone.

### `components/motion/`

Contains visual orchestration shared by more than one chapter:

- `EclipseThread` renders the optimized SVG and its meaningful static state.
- A page-level thread controller maps chapter progress to ring, line, orbit, flow, signature, and closing-ring states.
- Small helpers connect GSAP timelines to scoped React refs without owning copy or navigation.

The page-level thread coordinates; each chapter owns the animation of its internal elements. This boundary prevents one global timeline from reaching into every component's private DOM.

All GSAP work uses `useGSAP()` or a scoped context, is reverted on unmount, and is declared inside `gsap.matchMedia()` conditions where behavior changes by breakpoint or motion preference. Create triggers in document order. Never animate the pinned container itself, run layout reads on every scroll event, or introduce scroll smoothing.

Desktop may use scrubbing and short pinned stages. Tablet shortens them. Mobile uses local thread states, ordinary document flow, and restrained reveals. Reduced-motion mode renders the final meaningful state immediately and removes video scrubbing and long sticky regions.

### `components/media/`

Owns resilient media behavior shared by products, the hero, Aegis, and the founder note. `ProductMedia` chooses an appropriate source, displays its poster immediately, lazy-loads below the fold, and keeps the title, description, and CTA intact if video fails.

Autoplay video is muted, inline, nonessential, and never the only source of information. A real, copyable code block is used for Aegis; a fake terminal is not.

### `components/seo/`

Produces locale-specific document metadata, canonical URLs, reciprocal `hreflang`, Open Graph data, and structured metadata where justified. Metadata is sourced from validated content rather than duplicated in route files.

### `config/`

Is the only application layer that reads `import.meta.env`. Validate public configuration at startup/build time and expose named values for the contact endpoint, canonical site origin, antispam public key, analytics key, and externally supplied URLs.

Missing launch-critical configuration must fail the production build with a clear message. Development may use explicit placeholders only when they cannot be shipped accidentally.

### `content/`

Holds the bilingual editorial model: hero, thesis, product chapters, evidence, services, Aegis, founder note, contact, footer, metadata, alternative text, and external destinations. Portuguese and English share a TypeScript contract but contain separately edited prose.

Publication-sensitive data carries explicit state:

- Metrics require value, period, definition, source, and approval.
- Testimonials require attribution and permission metadata.
- Product claims require review status where legal, financial, or tax wording is involved.
- Aegis content requires confirmed release status, license, real code, environments, and URLs.

The production build rejects unapproved evidence, invented placeholders, and missing destinations instead of silently publishing them.

### `i18n/`

Owns short interface strings such as navigation labels, form messages, copy confirmation, loading states, and accessible announcements. Editorial content stays in `content/` so translators can review complete passages in context.

The selected locale is persisted. Changing `/pt` to `/en`, or the reverse, keeps the visitor at the same stable chapter anchor. No content block mixes languages except proper names and established technical terms.

### `forms/`

Owns the contact experience and its accessible field compositions. `EssentialContactForm` uses three persistent labeled fields: name, email, and message. Zod supplies client-side feedback; the endpoint remains authoritative.

The form models these states explicitly:

```text
empty → invalid
      → submitting → success
                   → failure → email fallback emphasized
```

Submitting preserves button width and sets `aria-busy`. Invalid fields render local messages and contribute to an accessible error summary. Failure preserves every entered value. Success stays in context and does not require a redirect.

### `services/`

Contains external effects with no UI logic. `contact.ts` submits the validated payload and antispam token through the shared client, normalizes expected failures, and does not retry automatically. The service never sends analytics.

Email copying remains a browser utility because it does not contact a server. Its component announces success and provides a manual selection fallback if Clipboard API access is unavailable.

### `lib/`

Contains thin setup and adapters, not narrative logic:

- `gsap.ts` registers ScrollTrigger once.
- `queryClient.ts` configures conservative request defaults.
- `apiClient.ts` configures the contact origin, timeout, and safe error boundary.
- `analytics.ts` is the only module that imports PostHog.

`analytics.ts` exports typed functions for the approved event names only:

```text
hero_product_click
hero_contact_click
product_view
product_click
aegis_github_click
aegis_docs_click
contact_start
contact_submit_success
contact_submit_error
email_copy
language_change
```

Payload types must not accept form text, copied content, financial data visible in media, or other sensitive values. If analytics fails or is blocked, interaction continues normally.

### `routes/` and `pages/`

Routes define `/pt` and `/en` as crawlable locale entries plus the root locale decision. The locale landing page composes `LandingShell` from validated content and owns route-level metadata. Sections are anchors within the locale route, not separate client-only pages.

The production build statically renders both locale routes. Client hydration adds progressive navigation and enhancement; primary copy and ordinary links are already present in HTML.

### `schemas/`

Contains runtime contracts at boundaries: contact input, public configuration, editorial content, approved evidence, and analytics payloads. Keep a schema beside its single consumer; promote it here when it validates shared or external data.

### `store/`

Exists for genuinely shared interactive state only. A small landing store may coordinate the active product chapter or progressive-navigation state when refs and component-local state are insufficient. It must not duplicate router locale, TanStack Query request state, TanStack Form state, or GSAP timeline progress.

Delete the directory if no cross-section state survives implementation.

### `hooks/`

Contains reusable React behavior such as locale-preserving chapter navigation, reduced-motion preference, media readiness, and analytics visibility. Component-specific GSAP setup remains beside the component unless multiple chapters share the exact behavior.

### `styles/`

`tokens.css` is the source of truth for the visual system, including:

- deep navy, navy, raised navy, ivory, secondary text, copper, lines, and grid;
- Poppins and JetBrains Mono families and approved weights;
- the `1180px` container and `48px` / `28px` / `20px` responsive padding;
- restrained radii and structural rules;
- the guide's standard, enter, hover, reveal, navigation, and transform timings.

`globals.css` establishes the initial `#090D18` paint, semantic typography, focus visibility, skip link, media defaults, and static/reduced-motion fallbacks. Product-specific colors do not become global tokens.

### `types/` and `utils/`

Use `types/` only for types that have no clearer owner. Use `utils/` only for pure, DOM-light functions such as stable chapter-anchor mapping or locale URL construction. Do not turn either directory into a miscellaneous dumping ground.

---

## Data and Interaction Flows

### Locale switch

```text
current locale route + current chapter id
→ build equivalent locale URL
→ navigate without losing chapter
→ persist explicit preference
→ update metadata and emit `language_change`
```

### Contact submission

```text
input
→ TanStack Form state
→ Zod field validation
→ contact service + antispam token
→ TanStack Query mutation
→ in-context success

failure
→ normalized visitor-safe message
→ preserve all field values
→ emphasize copyable public email
```

### Product chapter activation

```text
semantic product chapters in document order
→ breakpoint-appropriate observer/ScrollTrigger
→ active chapter presentation + eclipse state
→ deduplicated `product_view`
```

Analytics observes outcomes; it never controls navigation, submission, or animation.

---

## Testing

### Unit tests

- Content contracts reject missing links, unapproved evidence, and unequal product definitions.
- Locale helpers preserve the current chapter.
- Contact schemas cover empty, invalid, and valid input.
- Analytics types and adapters permit only approved event names and safe payloads.
- Media and clipboard helpers return explicit fallbacks.

### Component tests

- Every narrative component renders useful Portuguese and English content without motion.
- Navigation, compact menu, language switch, and copy action work by keyboard.
- Form labels, error summary, `aria-busy`, success, failure, and retained values are observable.
- Product media keeps poster, copy, and CTA when playback fails.
- Reduced-motion rendering contains the same copy, order, and actions.

### End-to-end tests

- `/pt` and `/en` load with correct metadata, canonical, and `hreflang` values.
- Language changes preserve chapter position.
- The three products receive equal navigation and CTA treatment.
- Desktop uses the intended sticky product stage without trapping scroll.
- Mobile returns products to normal flow and exposes `44 × 44px` minimum targets.
- Contact success, server rejection, timeout, and email fallback all work without losing input.
- Analytics requests never contain contact values or copied content.
- The statically rendered build exposes primary content and links before hydration.

Run accessibility checks against the brightest and darkest representative media frames, then verify keyboard flow and announcements manually. Profile the complete experience on a representative mid-range phone; desktop-only synthetic scores are insufficient evidence for scroll performance.
