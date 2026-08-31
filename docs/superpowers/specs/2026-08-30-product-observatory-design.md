# Product Observatory — Desktop Product Section Design

## Status

Approved direction. This document defines the experience and implementation boundaries for replacing the current desktop product orbit with a scroll-driven Product Observatory.

## Job and audience

The product section is the most important proof surface after the hero. It must help a prospective client, partner, or product user understand that Voynan does not merely deliver software: it builds and operates a real portfolio.

The visitor should leave the section able to recall:

- Voynan has three SaaS products in production: CryptoVault, BullLedger, and SafeNumber.
- Constrully is a fourth product in active development, not a launched product.
- Each product addresses a materially different operational problem.
- Voynan applies product-operating experience to client work.

The visitor mode is **Persuade**. The section earns confidence through clarity, product specificity, and honest evidence rather than exaggerated claims.

## Outcome and proof

The primary outcome is comprehension of the portfolio as a coherent body of operated products. The secondary outcome is exploration of an approved product destination when one becomes available.

The section must carry these forms of proof:

- Product name, lifecycle status, promise, supporting copy, and capabilities.
- Approved product media when available.
- An honest conceptual system diagram when approved media is missing. It must be labeled as conceptual and must never resemble or imply a real product screenshot.
- Existing analytics for product visibility and approved destination clicks.

No new commercial, legal, financial, security, adoption, or performance claims are introduced by this redesign.

## Selected direction

### Structural thesis

Replace the narrow left-side orbit and four independent near-viewport chapters with one coherent, desktop-only **Product Observatory**: a sticky editorial stage whose active product changes across four native scroll segments.

The experience combines scroll-led discovery with direct visitor control:

- Scrolling advances the portfolio in its authored order.
- A persistent product index exposes all four products and their lifecycle state.
- Selecting an index item scrolls to that product's segment.
- No wheel interception, scroll locking, artificial snapping, or autoplay is allowed.

The observatory is a progressive enhancement. Without JavaScript, with reduced motion, or below the desktop breakpoint, all products remain complete chapters in ordinary document flow.

### Composition

The section has three moments:

1. **Overture:** a concise portfolio heading and the factual summary “3 SaaS em produção · 1 produto em desenvolvimento.”
2. **Observatory:** the sticky product stage and four scroll segments.
3. **Release:** a short closing bridge into the following proof/service content, reinforcing that operating these products informs Voynan's client work.

Desktop stage topology:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ PRODUTOS VOYNAN                 01 ━━━ 02 ─── 03 ─── 04                 │
│                                 Crypto  Bull   Safe   Constrully         │
│──────────────────────────────────────────────────────────────────────────│
│                                                                          │
│  01 / SaaS · EM PRODUÇÃO        ┌─────────────────────────────────────┐  │
│  CryptoVault                    │                                     │  │
│                                 │  approved media or honest            │  │
│  Protect files. Prove their     │  conceptual system diagram           │  │
│  integrity.                     │                                     │  │
│                                 └─────────────────────────────────────┘  │
│  Supporting copy                                                        │
│  — Capability                                                            │
│  — Capability                                                            │
│  — Capability                                                            │
│  Product destination                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

The persistent index occupies the full horizontal measure instead of consuming two narrow grid columns. Below it, copy uses approximately four columns and product evidence uses approximately seven, separated by one breathing column. The composition stays left-aligned and follows the existing 12-column system.

### Visual authority

The observatory expands the established **Quiet Orbital Precision** world:

- Deep navy fields and manuscript ivory remain dominant.
- Copper is used only for the current progress relationship and primary action.
- Fine structural rules, technical indices, and measured spacing create the instrument-like character.
- The existing starfield may continue as atmospheric continuity, but it must remain subordinate and must not restart for each product.
- The previous literal ellipse is removed. “Orbital” becomes a sense of continuity and progression, not a decorative ring.
- Product-specific colors remain prohibited outside approved product-owned media or lockups with a written exception.

## Interaction sequence

### Entry

The overture enters in normal document flow. The product index and stage become sticky only after the stage reaches its intended desktop top boundary. Native scroll position remains visible and predictable.

### Product progression

The four products own equal scroll segments in this order:

1. CryptoVault — production
2. BullLedger — production
3. SafeNumber — production
4. Constrully — development

As a segment becomes active:

1. The progress rule advances to its marker.
2. The previous copy loses opacity and moves upward by a small distance.
3. The next copy enters from below.
4. Product evidence changes inside a stable frame rather than moving the entire layout.
5. Number, name, status, copy, and evidence become current as one transaction.

Transitions use transform and opacity only. The intended feel is a calibrated handoff, not a slideshow. There is no blur, elastic bounce, large zoom, parallax on reading copy, or animation whose completion is required to understand the product.

### Direct selection

The index is a real navigation control, not a decorative progress readout.

- Each product name and number has a minimum 44 × 44px target.
- Selecting an item scrolls to that product's segment.
- The current item exposes `aria-current` and remains identifiable without color.
- Hover and focus preview emphasis but do not replace the active product until selection.
- Explicit selection may update the URL fragment; passive scrolling must not create browser-history entries.

### Exit

After Constrully, the sticky stage releases naturally. The last marker remains visually distinct as **development**, using text and an incomplete or outlined marker rather than relying on color alone.

## Product evidence system

The evidence frame keeps one geometry across all products so the visitor compares products rather than layouts.

When approved media exists, render the existing production `ProductMedia` primitive with its approved alt text and sources.

When media is missing, render a conceptual system diagram using only verified capabilities:

- **CryptoVault:** file → authenticated encryption → integrity validation → verifiable record.
- **BullLedger:** Brazil, United States, and Canada inputs → organized ledger → reports and insights.
- **SafeNumber:** suspicious contact → crossed information → submitted evidence → client verification.
- **Constrully:** expenses and taxes → construction context → operational and tax reports.

The fallback must display a visible label equivalent to “Representação conceitual” and must not use browser chrome, app-shell framing, fabricated charts, invented numbers, or controls that imply implemented product UI.

SafeNumber receives the narrative peak because its problem requires the most explanation. Its diagram should make the relationship between professional impersonation, client verification, evidence collection, and possible legal action immediately legible. It may be denser than the other diagrams, but it must use the same visual grammar.

## Content behavior

Existing approved product copy remains authoritative. The redesign may change line breaks and visual grouping, but not claims or product meaning.

Lifecycle status is always adjacent to the product name:

- CryptoVault, BullLedger, and SafeNumber: “Em produção.”
- Constrully: “Em desenvolvimento.”

Missing destinations remain visibly unavailable and non-interactive. The interface must not present a disabled control whose wording suggests the product itself is unavailable; only the destination is pending.

Long localized content must wrap without truncating product names, lifecycle status, headlines, capability text, or navigation labels. English and Portuguese are first-class layouts.

## Component architecture

The existing `SaaSStoryStage` public contract may remain to limit integration churn, but its internal responsibilities should be divided:

- **ProductObservatory:** owns section structure, enhancement state, active product state, and progressive fallback.
- **ProductObservatoryHeader:** renders the overture and portfolio count.
- **ProductProgressIndex:** renders semantic direct navigation and visual progress.
- **ProductStage:** owns the sticky layout and active-panel transitions.
- **ProductPanel:** renders one product's identity, copy, capabilities, destination, and evidence.
- **ProductEvidence:** chooses approved `ProductMedia` or the honest conceptual diagram.
- **ProductScrollSegments:** provides the four native scroll destinations and reports active-segment changes.

`ProgressOrbit` is retired. `ProductChapter` may be adapted into `ProductPanel` if doing so preserves a clear single responsibility; otherwise it should be replaced rather than carrying both the old chapter and new stage models.

## State and data flow

The ordered content array remains the source of truth. No product identifiers or lifecycle labels are duplicated in animation code.

State flow:

1. Product content creates the index, panels, evidence, and scroll segments.
2. Intersection observation or normalized section progress identifies the dominant segment.
3. A small hysteresis boundary prevents rapid active-product flicker around segment edges.
4. Active product state updates the index and visible panel together.
5. Existing `product_view` analytics fire once under the established visibility contract.
6. Explicit approved destination activation fires the existing `product_click` event.

Native CSS sticky positioning owns the stage. GSAP may orchestrate bounded transitions and progress drawing, but it must not create the pinning model or intercept scrolling. Animation setup remains scoped, responsive, and fully cleaned up.

## Responsive behavior

### Wide desktop

Use the full observatory composition: horizontal index, sticky stage, copy/evidence split, and four scroll segments.

### Compact desktop and tablet

When the evidence and copy can no longer maintain readable measures, disable the sticky observatory. Keep the horizontal index as direct anchor navigation only if it fits or can scroll horizontally without clipping.

### Mobile

Render four complete chapters in ordinary flow. Each chapter keeps status, copy, capabilities, evidence, and destination together. No pinned rail, overlay transition, or hidden active panel is used.

The desktop enhancement must never determine content order on mobile.

## Accessibility and resilience

- All four products exist in source order in the server-rendered document.
- Content is not hidden until the enhancement has initialized successfully.
- Inactive enhanced panels cannot receive focus and are not exposed as simultaneous current content.
- Automatic scroll-driven changes are not announced through a noisy live region.
- Direct index interaction follows ordinary link/navigation behavior and preserves visible keyboard focus.
- The active state uses text, position, marker shape, and `aria-current`, not copper alone.
- `prefers-reduced-motion: reduce` disables sticky alternation and presents the complete linear chapter fallback.
- A JavaScript or animation failure leaves a readable portfolio rather than an empty stage.
- Focused links and controls must never disappear because their product ceases to be active.

## Performance boundaries

- Animate only opacity, transform, and a progress scale or stroke.
- Do not animate layout properties, filters, large shadows, or background-size.
- Keep a single atmospheric layer for the whole section.
- Load only the active and next product's heavy approved media when practical; retain poster-first behavior.
- Avoid creating one ScrollTrigger per decorative sub-element.
- Recalculate geometry only at bounded responsive refresh points.

## Scope and anti-goals

In scope:

- Desktop product-section composition and interaction.
- Honest no-media evidence treatment.
- Responsive and reduced-motion fallbacks.
- Product index semantics and direct navigation.
- Preservation of current localized content and analytics.

Out of scope:

- Changing product facts, claims, destinations, or lifecycle state.
- Creating or fabricating product screenshots.
- Introducing product-specific interface colors.
- Redesigning the hero, thesis, credibility, services, or footer sections.
- Horizontal scroll, autoplay, scroll hijacking, forced snapping, or a carousel gesture.
- Adding a second site-wide navigation model.

## Verification strategy

### Component tests

- Renders all four products in source order with correct lifecycle labels.
- Selects a product from the index and targets its scroll segment.
- Keeps index and active panel synchronized.
- Preserves approved and pending destination behavior.
- Uses `ProductMedia` only for approved media.
- Renders a labeled conceptual diagram for missing media.
- Fires each established analytics event under its existing contract.

### Motion tests

- Desktop enhancement creates bounded progress and transition behavior without scroll interception.
- Reduced-motion mode creates no sticky alternation or scrubbed product transition.
- Responsive teardown removes observers and animation state cleanly.
- Active-product hysteresis prevents repeated changes at boundaries.

### Browser verification

- Inspect representative wide desktop, compact desktop/tablet, and mobile viewports in Portuguese and English.
- Confirm the first and last products enter and release without blank scroll ranges.
- Confirm direct index navigation, keyboard focus, browser back behavior, and URL fragments.
- Confirm long SafeNumber content and the Constrully development state do not overflow.
- Confirm no layout shift when evidence changes.
- Confirm JavaScript-disabled and reduced-motion fallbacks expose all content.

## Acceptance criteria

The redesign is complete when:

- The old orbit is absent.
- The visitor can identify all four products and their status before interacting.
- Scroll progress remains perceptible throughout the entire desktop observatory.
- Every index item is directly operable and keyboard accessible.
- Product transitions never interrupt or reverse native scrolling.
- SafeNumber's verification-and-evidence flow is understandable without reading every capability bullet.
- Constrully is visibly part of the portfolio and unmistakably still in development.
- Missing media is handled honestly without repeated generic placeholders or fabricated UI.
- Reduced-motion, no-JavaScript, tablet, and mobile experiences retain the complete product content.
- Existing content validation, unit tests, design detector, and application build pass.
