<!-- v2.0.0 | last changed 2026-08-13 -->

# Voynan Landing Page — Frontend Stack

React + TypeScript frontend for Voynan's bilingual, product-led landing page. The stack supports a cinematic desktop narrative without making motion a prerequisite for reading, navigation, or conversion.

This document is an implementation baseline derived from `voynan-landing-page-guide-en.md`. It is intentionally more robust than a one-off marketing page so the site can grow, but every dependency must have a current responsibility. Product-specific application concerns such as authentication, protected routes, financial arithmetic, and OAuth are outside this project.

---

## Installation

### OS-level

| Tool | Purpose |
|---|---|
| **Bun** | JavaScript runtime, package manager, and task runner |

### Project-level

When implementation is scaffolded, declare the dependencies below in `package.json` and install them with `bun install`. This document defines the target stack; it does not imply that the current documentation-only repository has already installed it.

| Package | Purpose |
|---|---|
| **react** + **react-dom** | UI rendering and build-time static rendering |
| **typescript** | Type-safe content, components, events, and configuration |
| **vite** | Development server, asset pipeline, and production bundling |
| **tailwindcss** | Token-driven layout and styling |
| **shadcn/ui** + **Radix Primitives** | Selective accessible foundations for controls; not the page's visual language |
| **gsap** + **ScrollTrigger** | Scroll-linked timelines, pinned desktop scenes, and the eclipse thread |
| **@gsap/react** | React lifecycle integration and automatic animation cleanup |
| **@tanstack/react-router** | Typed `/pt` and `/en` routes and language-preserving navigation |
| **@tanstack/react-query** | Contact submission state and future server-backed content where caching is useful |
| **@tanstack/react-form** | Accessible contact-form state and field coordination |
| **zod** | Contact validation, public configuration validation, and content contracts |
| **axios** | Contact endpoint transport with a centralized timeout and normalized errors |
| **zustand** | Small cross-section UI state only when state cannot stay local |
| **react-i18next** | Interface translations, validation messages, metadata, and locale persistence |
| **posthog-js** | Allowlisted conversion analytics without contact text or sensitive media data |
| **vitest** + **@testing-library/react** | Unit and component tests |
| **msw** | Contact endpoint behavior in tests |
| **playwright** | End-to-end, responsive, reduced-motion, and failure-path tests |
| **eslint** + **prettier** | Static checks and formatting |

`ScrollTrigger` ships with GSAP and is registered explicitly. No second JavaScript animation library, smooth-scroll package, WebGL engine, or Three.js dependency belongs in the initial release.

---

## Technology Decisions

| Concern | Choice | Rationale and constraints |
|---|---|---|
| Core | **React + TypeScript + Vite** | Keeps component and tooling boundaries explicit while supporting the media-heavy experience. |
| Rendering | **Static prerender for `/pt` and `/en`, then hydrate** | Primary copy, landmarks, and links remain available before JavaScript. Hydration adds navigation behavior, analytics, the form, and motion. |
| Styling | **Tailwind CSS backed by CSS custom properties** | Voynan's navy, ivory, copper, typography, spacing, and motion tokens remain centralized. Arbitrary one-off values should not replace named tokens. |
| UI primitives | **Selective shadcn/ui and Radix** | Use for behavior-heavy controls such as the compact menu, labels, and accessible announcements. Copied shadcn code may be restyled substantially. Narrative sections are custom Voynan components. |
| Narrative motion | **GSAP + ScrollTrigger** | Supports scrubbed progress, pinned product acts, SVG sequencing, responsive timelines, and explicit cleanup. It must not trap or smooth the user's scroll. |
| Microinteractions | **CSS transitions and keyframes** | Hover, focus, button feedback, and small state changes do not need GSAP. CSS is not a second orchestration layer. |
| Responsive motion | **`gsap.matchMedia()`** | Desktop may use the continuous thread and pinned stages. Tablet shortens them; mobile returns products to document flow and uses local thread states. |
| Reduced motion | **Static-first rendering plus media-query variants** | `prefers-reduced-motion: reduce` removes scrubbing, long pins, and video-dependent reveals while preserving the same copy, order, and CTAs. |
| Routing | **TanStack Router** | `/pt` and `/en` are first-class routes. A language change preserves the current chapter anchor and selected preference. |
| Editorial content | **Typed locale content modules** | Long-form section content, claims, product capabilities, evidence, alt text, and links are data rather than JSX. English is an editorial adaptation, not a runtime machine translation. |
| UI translation | **react-i18next** | Owns short interface strings, validation, statuses, metadata labels, and language persistence. It does not fragment the editorial narrative into opaque inline keys. |
| Forms | **TanStack Form + Zod** | The three-field form keeps persistent labels, field errors, an accessible summary, submitted data on failure, and explicit empty/submitting/success/failure states. |
| Server state | **TanStack Query** | The contact mutation owns retries and request state. Automatic retries stay disabled for submissions to prevent duplicate messages. |
| HTTP | **axios through one contact client** | Adds a bounded timeout, antispam token transport, and error normalization. Components never call axios directly. |
| Client state | **Local state first; Zustand only across sections** | The active product chapter or global thread state may use a small store if DOM-local coordination is insufficient. Form and server state stay in their dedicated tools. |
| Analytics | **PostHog through an allowlisted adapter** | Only events listed in the landing-page guide may be emitted. Event payload types must make message text, copied values, and sensitive screenshot data unrepresentable. |
| Testing | **Vitest + Testing Library + MSW + Playwright** | Covers isolated content variants, controls, form states, routing, analytics contracts, responsive flow, media fallback, and reduced motion. |

---

## Component Strategy

### Accessible primitives

`components/ui/` is a small, reviewed layer. Prefer native HTML first. Adopt a shadcn/Radix primitive only when it provides meaningful interaction behavior, focus management, or assistive-technology support.

Likely primitives are `Button`, `Field`, `Label`, a compact navigation control, and visually hidden/live-region helpers. Generic card, carousel, dashboard, and decorative component collections are not part of the visual system.

### Voynan narrative components

All distinctive composition lives in `components/landing/`: the progressive navigation, hero, thesis, three equal SaaS chapters, credibility field, services flow, Aegis chapter, founder note, contact, and footer. These components accept typed content and render a complete static state before attaching motion.

Shared motion infrastructure lives separately in `components/motion/`. The continuous eclipse thread may coordinate the page, but it must never own or conceal semantic content.

---

## Motion Performance Contract

- Animate `transform` and `opacity` whenever possible.
- Keep the eclipse SVG simple and its DOM node count low; avoid large animated filters, blurs, and masks.
- Create ScrollTriggers in document order and scope them to their component.
- Use `useGSAP()` or a GSAP context so every timeline and trigger is reverted on unmount.
- Do not animate a pinned container itself; animate its children.
- Use one dominant animation per viewport and avoid overlapping pinned scenes.
- Never read layout continuously inside a scroll callback.
- Refresh ScrollTrigger only after layout-affecting media or fonts settle, not on every state change.
- Lazy-load below-the-fold media and preload only the next approaching product chapter.
- Supply explicit media dimensions, posters, mobile encodes, and static failure states.
- Treat the footer atmosphere as disposable enhancement. It must not introduce a canvas dependency in the first release.

Performance acceptance must include profiling on a representative mid-range phone, not only a desktop Lighthouse run. The page remains usable when animation, video, analytics, or the contact endpoint fails independently.

---

## Rendering, SEO, and Internationalization

- Generate crawlable HTML for `/pt` and `/en` during the production build.
- The root route chooses Portuguese by default while preserving a visitor's explicit saved preference.
- Each locale owns its title, description, Open Graph copy, canonical URL, and reciprocal `hreflang` links.
- The language switch keeps the current section id when moving between locale routes.
- The initial background color is `#090D18`; essential typography, logo, and hero poster load before optional video.
- Semantic content order is independent from the cinematic grid, so disabling CSS or JavaScript does not reorder the argument.

---

## Contact and Privacy Boundary

The browser validates name, email, and message for usability; the endpoint remains authoritative. On failure, the entered message stays in form state and the visible email-copy alternative receives emphasis. Technical error codes never reach the visitor.

Analytics may record `contact_start`, `contact_submit_success`, and `contact_submit_error`, but never field values, clipboard contents, or the message body. Antispam integration is isolated behind the contact service so providers can change without rewriting the form.

---

## Stack at a Glance

React · TypeScript · Vite · Bun · Tailwind CSS · selective shadcn/ui and Radix · GSAP · ScrollTrigger · `@gsap/react` · TanStack Router · TanStack Query · TanStack Form · Zod · axios · Zustand · react-i18next · PostHog · Vitest · Testing Library · MSW · Playwright · ESLint · Prettier
