# Terafab-Inspired UX/UI Design System & Style Guide

> **Purpose:** A production-ready visual and interaction blueprint for creating an original website with the same broad design language as [Terafab](https://terafab.ai/): cinematic industrial futurism, restrained editorial typography, data-driven scale demonstrations, and immersive scroll storytelling.
>
> **Analysis basis:** Live site and public stylesheet inspected on August 13, 2026, at a 1280 × 720 desktop viewport and a 390 × 844 mobile viewport. Values marked **Observed** are taken from the live implementation or computed styles. Values marked **Extension** are recommended additions for states the reference site does not visibly use.
>
> **Originality requirement:** Reproduce the system and atmosphere, not Terafab’s trademarks, copy, proprietary imagery, logos, or distinctive branded assets. Replace them with original brand elements and original media.

---

## 1. Brand Identity & Atmosphere

### 1.1 General aesthetic

- **Primary aesthetic:** Cinematic industrial futurism with editorial restraint.
- **Secondary influences:** Aerospace visualization, scientific instrumentation, large-scale infrastructure, technical documentary filmmaking, and premium automotive launch pages.
- **Mood:** Monumental, ambitious, sober, precise, engineering-led, and quietly optimistic.
- **Tone:** Serious rather than playful; visionary without resorting to conventional “AI neon” clichés.
- **Visual density:** Low UI density around high-impact imagery. Each screen has one dominant idea.
- **Color philosophy:** The interface is nearly monochrome; photography and video supply almost all color.
- **Surface philosophy:** Flat and structural. Avoid conventional SaaS cards, bubbly containers, pill buttons, thick borders, colorful icon tiles, and decorative glass panels.

### 1.2 Core visual themes

- **Scale as narrative:** Human, facility, planet, star, orbit, and civilization-scale references progressively expand the story.
- **Darkness as a canvas:** Pure black is not merely a theme color; it joins scenes, masks media edges, creates cinematic pauses, and makes sections feel continuous.
- **Engineering guides:** One-pixel structural rules, 12-column alignment, dashed measurement lines, numeric prefixes, and small captions make the page feel measured rather than decorated.
- **Media-led storytelling:** Full-bleed video, restrained scrims, scale diagrams, product imagery, and scroll-linked sequences do most of the persuasive work.
- **Minimal chrome:** Navigation, controls, and CTAs stay visually quiet so the imagery remains dominant.
- **Selective warmth:** Orange, solar gold, and faint violet/blue appear only when the content calls for energy, heat, or sunlight.
- **Progressive disclosure:** Details appear as the visitor scrolls; the page rarely presents the entire argument at once.

### 1.3 Recurring motifs

- Pure-black section seams that visually dissolve the boundary between adjacent scenes.
- Large, lightweight, tightly tracked headings placed on strong left or right alignment rails.
- Small muted kickers above major statements.
- Faint horizontal separators and vertical construction guides.
- Image and video scrims that preserve legibility without visibly “boxing” the text.
- Compact chevrons or directional arrows in CTAs.
- Desaturated logos that brighten only on hover.
- Sticky or scrubbed sequences for concepts involving time, comparison, or scale.
- Square-edged media crops and minimal border radii.
- Scientific callouts: dashed leaders, small labels, numbered lists, and tabular numerals.

### 1.4 Emotional progression between sections

The sections should form one continuous argument rather than a collection of independent landing-page modules:

1. **Hero — establish awe:** Open with a moving, high-production-value world and a concise mission.
2. **Thesis — clarify the problem:** Transition to black and state the central gap or opportunity in a large editorial sentence.
3. **Macro context — expand the frame:** Use a sticky visual model to show where the mission sits within a larger scale.
4. **Resource/energy scene — connect cause to outcome:** Show what powers the mission and attach three concrete implications.
5. **Credibility — prove capability:** Shift from aspiration to evidence using aligned brand or project rows.
6. **Solution overview — reveal the physical answer:** Return to cinematic imagery with the key proposition placed over it.
7. **Capacity — quantify ambition:** Pair large figures with a physical comparison graphic.
8. **Production comparison — make scale tangible:** Use a scroll-scrub sequence, not a static chart, to reveal the difference progressively.
9. **Product/output mosaic — identify deliverables:** Present a precise grid of outputs after the infrastructure story has been established.
10. **Strategic comparison — explain why the future moves elsewhere:** Contrast two cost or capability models in parallel columns.
11. **Next frontier — end with a larger horizon:** Finish on a cinematic scene and a single action.
12. **Footer CTA — convert inspiration into participation:** Return to a simple recruitment or contact invitation.

### 1.5 Design principles

- **One screen, one idea.** Avoid competing headlines, illustrations, and CTAs in the same viewport.
- **Imagery is the accent color.** UI components should not compete with the media palette.
- **Use motion to explain.** Scroll effects must clarify sequence, comparison, or scale.
- **Restraint creates authority.** Prefer one strong rule, one strong heading, and one strong image over multiple decorative layers.
- **Keep the grid visible but quiet.** Structural lines should be felt before they are noticed.
- **Maintain continuous atmosphere.** Adjacent sections should share black fades, alignment rails, and motion cadence.

---

## 2. Color Palette

### 2.1 Observed core tokens

```css
:root {
  --color-bg: #000000;                    /* rgb(0, 0, 0) */
  --color-bg-secondary: #000000;          /* intentionally same as base */

  --color-text-primary: #EDEDEE;          /* rgb(237, 237, 238) */
  --color-text-heading: #FFFFFF;          /* rgb(255, 255, 255) */
  --color-text-secondary: rgba(237, 237, 238, 0.62);
  --color-text-tertiary: rgba(237, 237, 238, 0.40);

  --color-line: rgba(255, 255, 255, 0.13);
  --color-line-strong: rgba(255, 255, 255, 0.24);
  --color-gridline: rgba(255, 255, 255, 0.03);

  --color-guide: #1F1F1F;                 /* rgb(31, 31, 31) */
  --color-guide-soft: #1A1A1A;            /* rgb(26, 26, 26) */
  --color-guide-faint: #141414;            /* rgb(20, 20, 20) */

  --color-on-light: #0A0A0B;              /* rgb(10, 10, 11) */
  --color-surface-primary: #EDEDEE;
  --color-surface-primary-hover: #FFFFFF;
  --color-surface-primary-active: #F5F5F6;

  --color-accent-energy: #FF6A28;          /* rgb(255, 106, 40) */
}
```

### 2.2 Palette roles

| Role | Value | Use |
|---|---:|---|
| **Primary background** | `#000000` | Body, section seams, media fallback, sticky-stage background |
| **Heading text** | `#FFFFFF` | H1/H2, winning comparison, primary numeric values |
| **Primary body text** | `#EDEDEE` | High-priority copy, active navigation CTA |
| **Secondary text** | `rgba(237,237,238,.62)` | Body copy, list items, standard nav links |
| **Tertiary text** | `rgba(237,237,238,.40)` | Kicker, captions, numeric prefixes, subdued clauses |
| **Standard divider** | `rgba(255,255,255,.13)` | Lists, footer rule, data rows |
| **Strong divider** | `rgba(255,255,255,.24)` | Comparison headers, stronger measurement rules |
| **Faint grid** | `rgba(255,255,255,.03)` | Ambient canvas/grid field |
| **Primary CTA fill** | `#EDEDEE` | Main action on dark media |
| **Primary CTA text** | `#0A0A0B` | Text/icon on primary CTA |
| **Secondary CTA fill** | `rgba(255,255,255,.15)` | Secondary action over hero media |
| **Secondary CTA hover** | `rgba(255,255,255,.22)` | Hover feedback |
| **Energy accent** | `#FF6A28` | High-output gauge, heat/energy highlight only |

### 2.3 Background and overlay recipes

**Hero legibility scrim:** combine a left-to-right darkening gradient with a top-to-bottom cinematic fade.

```css
background:
  linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.42) 28%,
    rgba(0, 0, 0, 0.12) 52%,
    transparent 78%
  ),
  linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.08) 22%,
    rgba(0, 0, 0, 0.15) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
```

**Section seam:** fade the preceding media into black over approximately `120–240px`.

```css
background: linear-gradient(
  180deg,
  transparent 0%,
  rgba(0, 0, 0, 0.42) 38%,
  rgba(0, 0, 0, 0.78) 62%,
  #000000 100%
);
```

**Solar ambient accents:** reserve these for media overlays, not ordinary UI.

```css
--solar-core: rgba(255, 240, 212, 0.92);
--solar-mid: rgba(255, 214, 158, 0.52);
--solar-edge: rgba(255, 188, 116, 0.22);
--solar-fade: rgba(255, 168, 92, 0.07);

--spectral-violet: rgba(108, 82, 210, 0.45);
--spectral-pink: rgba(200, 118, 220, 0.55);
--spectral-blue: rgba(92, 148, 235, 0.45);
```

### 2.4 Energy/output gradient

Use the orange scale only for a genuinely exceptional or “winning” value.

```css
--gradient-energy: linear-gradient(
  90deg,
  #4A1604 0%,
  #7A2808 22%,
  #C7440A 48%,
  #FF7A38 78%,
  #FF6A28 100%
);

--shadow-energy: 10px 0 26px rgba(255, 106, 40, 0.38);
```

### 2.5 Functional colors

The reference site is a narrative marketing experience and does not expose success, warning, error, or form-validation states. For a production system, add a restrained semantic layer without changing the visual atmosphere.

```css
/* Extension — not observed on the reference site */
--color-success: #79C995;
--color-warning: #FFB15C;
--color-error: #FF6B6B;
--color-info: #7AA2FF;

--color-success-bg: rgba(121, 201, 149, 0.10);
--color-warning-bg: rgba(255, 177, 92, 0.10);
--color-error-bg: rgba(255, 107, 107, 0.10);
--color-info-bg: rgba(122, 162, 255, 0.10);
```

- Use semantic colors as a `1px` rule, icon, and concise message—not a large saturated panel.
- Never use the orange energy accent for errors; it already has narrative meaning.
- Pair every semantic color with text and iconography. Do not rely on color alone.

### 2.6 Contrast guidance

- `#FFFFFF` and `#EDEDEE` on black are appropriate for headings and primary text.
- `rgba(237,237,238,.62)` is suitable for normal-size supporting copy when verified against the final composite background.
- `rgba(237,237,238,.40)` should be restricted to nonessential labels at `12px+`; it may not meet WCAG AA for required content.
- Over media, measure contrast against the darkest and brightest frames, not a single poster image.
- Add a local scrim behind critical text rather than increasing every text color to full white.

---

## 3. Typography System

### 3.1 Font families

```css
:root {
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-heading: "Inter Tight", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Space Grotesk", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-expanded: "Unbounded", "Archivo Expanded", "Space Grotesk", "Inter", sans-serif;
}
```

- **Headings:** `Inter Tight`, weight `300` by default.
- **Body/UI:** `Inter`, weights `400–500`.
- **Expanded technical labels:** `Unbounded` first, `Archivo Expanded` fallback, weight `500`.
- **Monospace/code:** No monospace family is central to the observed aesthetic. Use the expanded technical face for chip/model identifiers. If real code is required, add `IBM Plex Mono` or `Geist Mono` only inside code-specific components.

### 3.2 Type hierarchy

| Token | Desktop/Fluid size | Weight | Line height | Tracking | Usage |
|---|---|---:|---:|---:|---|
| `type-hero` | `clamp(2.4rem, 5.2vw, 4.4rem)` (`38.4–70.4px`) | 300 | `1.02` | `-0.035em` | Hero name/mission |
| `type-kard-title` | `clamp(2rem, 4.4vw, 3.9rem)` (`32–62.4px`) | 300 | `1.04` | `-0.032em` | Sticky macro-scale title |
| `type-section-h2` | `clamp(2.15rem, 3.85vw, 3.5rem)` (`34.4–56px`) | 300 | `1.02` | `-0.032em` | Standard section heading |
| `type-footer-h2` | `clamp(2.3rem, 5.1vw, 4rem)` (`36.8–64px`) | 300 | `1.00` | `-0.042em` | Closing CTA |
| `type-statement` | `clamp(1.6rem, 3.4vw, 2.8rem)` (`25.6–44.8px`) | 300 | `1.22` | `-0.027em` | Editorial thesis |
| `type-stat` | `clamp(2.2rem, 4.4vw, 3.5rem)` (`35.2–56px`) | 300 | `1.00` | `-0.035em` | Capacity figures |
| `type-hero-copy` | `clamp(1.1rem, 2vw, 1.55rem)` (`17.6–24.8px`) | 300 | `1.25` | `-0.02em` | Hero support line |
| `type-section-body` | `clamp(.98rem, 1.35vw, 1.12rem)` (`15.68–17.92px`) | 400 | `1.50` | Normal | Section description |
| `type-body` | `1rem` (`16px`) | 400 | `1.60` | Normal | Default body copy |
| `type-list-lg` | `1.08rem` (`17.28px`) | 400 | Inherited | Normal | Key scene lists |
| `type-list-sm` | `.94rem` (`15.04px`) | 400 | `1.45` | Normal | Evidence rows |
| `type-cta` | `.9rem` (`14.4px`) | 500 | `1.00` | `.01em` | Buttons/links |
| `type-nav` | `13px` | 400 | `1.60` | `.02em` | Sticky nav actions |
| `type-kicker` | `12px` | 500 | `1.60` | `.02em` | Section label |
| `type-compare-label` | `.78rem` (`12.48px`) | 300 | `1.60` | `.02em` | Comparison header |
| `type-index` | `.7rem` (`11.2px`) | 400 | Inherited | `.04em` | `01`, `02`, `03` prefixes |
| `type-chip-code` | `clamp(.72rem, .95vw, .85rem)` (`11.52–13.6px`) | 500 | `1.00` | `.04em` | Uppercase model badge |

### 3.3 Mobile computed examples at 390px

- Hero H1: `38.4px / 39.17px`, weight `300`, tracking `-1.344px`.
- Standard H2: `34.4px / 35.09px`, weight `300`, tracking `-1.10px`.
- Hero supporting copy: `17.6px / 22px`, weight `300`.
- Editorial statement: `25.6px / 31.23px`, weight `300`.
- CTA text remains `14.4px`, weight `500`.
- Footer H2 uses an additional mobile override: `clamp(1.65rem, 7.8vw, 2.3rem)`.

### 3.4 Styling conventions

- Use **sentence case** for headings, labels, CTAs, and navigation.
- Use uppercase only for machine/model identifiers or an intentionally expanded wordmark.
- Keep headings at weight `300`; scale and negative tracking create authority without heavy boldness.
- Set section titles with `text-wrap: balance`; use `text-wrap: pretty` for longer editorial text.
- Typical title measure: `16–22ch`. Hero support: `18–22ch`. Statement: `24ch`.
- Avoid centered body copy. The system is predominantly left-aligned, including right-rail overlay copy.
- Use muted clauses within a heading to create an internal hierarchy rather than adding another subtitle.
- Enable optical sizing and high-quality rendering:

```css
body {
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

---

## 4. UI Components & Layout Patterns

### 4.1 Buttons & CTAs

#### Primary filled CTA

```css
.cta--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 11px 16px 11px 18px;
  min-height: 41px;
  border: 1px solid #EDEDEE;
  border-radius: 2px;
  background: #EDEDEE;
  color: #0A0A0B;
  font: 500 0.9rem/1 "Inter", sans-serif;
  letter-spacing: 0.01em;
  transition:
    color 220ms var(--ease-standard),
    background 220ms var(--ease-standard),
    border-color 220ms var(--ease-standard);
}

.cta--primary:hover {
  background: #FFFFFF;
  border-color: #FFFFFF;
}

.cta--primary:active {
  background: #F5F5F6;
}
```

#### Secondary translucent CTA

- Same padding, size, typography, and `2px` radius as primary.
- Default background: `rgba(255,255,255,.15)`.
- Hover background: `rgba(255,255,255,.22)`.
- Border remains transparent.
- Use only over media or black; do not place on light backgrounds.

#### Tertiary text CTA

- Transparent background and no visible border.
- Padding: `6px 2px 6px 0`.
- Text: secondary color; hover to full white.
- Pair with a compact animated arrow or chevron in a `1.15em × 1.15em` box.
- Use for “learn more” actions where the destination is supplementary.

#### Interaction states

| State | Primary | Secondary | Tertiary |
|---|---|---|---|
| Default | Off-white fill, near-black text | 15% white fill, white text | Transparent, secondary text |
| Hover | Pure-white fill | 22% white fill | Text becomes white |
| Active | `#F5F5F6` fill | Reduce to 18% white or apply `scale(.99)` | Return to `#EDEDEE` |
| Focus-visible | `2px` white at 45% opacity, `3–4px` offset | Same | Same |
| Disabled — Extension | `opacity: .38`, no hover, `cursor: not-allowed` | Same | Same |
| Loading — Extension | Preserve width; replace arrow with `14px` spinner; set `aria-busy=true` | Same | Inline spinner after label |

**Implementation correction:** Increase minimum touch height from the observed `41px` to at least `44px` on touch devices while keeping the visual padding nearly identical.

### 4.2 Cards & containers

The visual system avoids conventional cards. Use one of these patterns instead:

1. **Editorial row**
   - Transparent background.
   - Content divided by `1px` rules.
   - No radius, shadow, or elevated surface.
   - Best for evidence, features, costs, and specifications.

2. **Media tile**
   - Square-edged image crop with `overflow: hidden`.
   - `3:4` aspect ratio for product/chip tiles.
   - Caption sits `18px` below the image.
   - Model badge may use `1px rgba(255,255,255,.22)` border and `4px` radius.

3. **Full-bleed scene**
   - Media is absolutely positioned behind content.
   - Section minimum height: `96vh` or capped near `920px` where appropriate.
   - Use local scrims, never an opaque card behind the copy.

4. **Sticky stage**
   - A tall scroll shell contains a `position: sticky; top: 0; height: 100vh` visual.
   - Text and annotations are overlaid in the shared container.
   - Use for a single continuous comparison or progression only.

5. **Measurement plate**
   - Transparent background, full-width diagram.
   - Dashed leader lines and small `10–10.5px` labels.
   - Avoid decorative drop shadows.

**Glassmorphism rule:** Reserve backdrop blur for the navigation frost only. The reference look is not a glass-card system.

### 4.3 Navigation

#### Structure

- Fixed to the top with `z-index: 900`.
- Inner content uses the global container and alignment rails.
- Desktop padding: `18px 48px 14px`; tablet: `18px 28px 14px`; mobile: `18px 20px 14px`.
- Brand left, two short text actions right.
- Standard action gap: `30px`; narrow mobile gap: `18px`.
- No persistent solid navbar background.

#### Scroll behavior

- At the top, show the full wordmark and hide the right-side actions.
- As the visitor leaves the hero:
  - Collapse the wordmark to a compact initial/tile in approximately `480ms`.
  - Invert the mark to near-black inside an off-white `4px`-radius tile.
  - Reveal the actions with `opacity + translateY(-5px)` over `400ms`.
  - Stagger the second action by `70ms`.
- Build the navbar frost from four overlapping masked blur bands. The strongest blur stays at the top and fades downward over `124–172px`.
- Drive blur, tint, and fade with scroll variables rather than toggling a hard class-only background.

### 4.4 Footer

- Background remains pure black with a subtle canvas/dot-grid field.
- Top padding: `clamp(64px, 9vh, 112px)`; mobile: `clamp(36px, 6vh, 56px)`.
- Closing heading: oversized, lightweight, tightly tracked.
- Place the main CTA `32–48px` below the heading.
- Footer base begins after `72–112px` on desktop and `36–56px` below on tablet/mobile.
- Separate the legal row with a `1px` standard divider and `24px` top padding.
- Legal/credit text: `12.5px`, tertiary color.
- At `≤560px`, reverse the base-row stack so the most useful content appears first and align everything left.

### 4.5 Grid system

```css
:root {
  --container-max: 1180px;
  --page-pad-desktop: 48px;
  --page-pad-tablet: 28px;
  --page-pad-mobile: 20px;
  --grid-columns: 12;
}

.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--page-pad);
}

.layout-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 0;
}
```

- **Desktop:** 12 columns, no gutters between columns. Spacing comes from column spans and outer padding.
- **Content rail:** At a 1265px usable viewport, the 1180px container begins near `42.5px`; adding `48px` padding places the main content rail near `90.5px`, matching the live composition.
- **Structural guides:** Draw selected column borders at `#1F1F1F`, `#1A1A1A`, or `#141414`; do not outline every column.
- **Builders/evidence:** Logo in columns `1–3`, evidence group A in `4–7`, evidence group B in `8–12`.
- **Two-part capacity section:** Approximately `41% / 59%`, expressed as `.82fr / 1.18fr`, with `36–64px` gap.
- **Product mosaic:** Four tiles at `span 3` on desktop; two tiles at `span 6` below `980px`.
- **Orbital comparison:** Copy spans columns `1–6`; comparison spans `1–7`; background media remains full bleed.

### 4.6 Spacing system

Use a simple 4px-derived core scale for components, then fluid section tokens for cinematic rhythm.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;
--space-9: 36px;
--space-10: 40px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;

--section-pad-standard: clamp(80px, 13vh, 170px);
--section-pad-statement: clamp(80px, 14vh, 170px);
--section-pad-scene-bottom: clamp(60px, 10vh, 120px);
--section-head-gap: clamp(44px, 6vh, 76px);
--section-seam-height: clamp(120px, 18vh, 240px);
```

### 4.7 Section-specific layout patterns

| Section type | Layout | Relationship to adjacent sections |
|---|---|---|
| Hero | Full-bleed looping video; copy left; partner logos along lower rule | Bottom fade lands directly in black thesis section |
| Thesis | Single `24ch` editorial paragraph | Creates a quiet pause before the sticky macro scene |
| Macro scale | `340vh` desktop shell with `100vh` sticky stage | Exits into a full-bleed energy scene with a black seam |
| Energy scene | Copy in columns `1–9`, list in `1–5` | Turns abstract scale into three concrete outcomes |
| Evidence | 12-column subgrid rows | Resets motion intensity and proves the prior claim |
| Factory scene | Full-bleed media; copy on upper-right rail | Reintroduces spectacle after the evidence table |
| Capacity | Large stats left, illustration right | Quantifies the factory before revealing footprint scale |
| Output scale | Heading plus `300vh` scroll-scrub stage | Converts abstract numbers into spatial comparison |
| Product mosaic | Four equal square-edged media columns | Answers “what comes out of this system?” |
| Strategic compare | Full-bleed orbit scene, copy and two-column cost list left | Explains why the products and infrastructure matter |
| Frontier scene | Full-bleed image/video with minimal heading + one action | Hands emotional momentum to the footer CTA |

---

## 5. Visual FX, Animations & Micro-Interactions

### 5.1 Motion tokens

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);

  --duration-instant: 120ms;
  --duration-hover: 220ms;
  --duration-nav: 400ms;
  --duration-retract: 480ms;
  --duration-reveal: 800ms;
  --duration-line-draw: 1150ms;
  --duration-gauge: 1550ms;
}
```

### 5.2 Motion inventory

| Element | Trigger | Motion | Duration / stagger | Easing |
|---|---|---|---:|---|
| Standard reveal | Intersection enters viewport | `opacity 0→1`, `translateY(12px)→0` | `800ms` | Standard |
| Hero line | Page ready | Blur `11px→0`, `translateY(18%)→0`, fade in | `820ms`; `80/220/360/500ms` delays | Enter |
| Hero support/CTAs/logos | Page ready | Blur `8px→0`, `translateY(14%)→0` | `780ms`; `280/480/720ms` delays | Enter |
| CTA hover | Pointer hover | Fill/text color change | `220ms` | Standard |
| Nav actions | Scroll threshold | Fade + `translateY(-5px)→0` | `400ms`; second link `70ms` later | Standard |
| Wordmark retract | Scroll threshold | Remaining letters collapse; initial enters tile | `480ms` | Enter |
| Statement words | Scroll progress | Muted word becomes white | `400ms` each | Standard |
| Scale tier | Scroll/video progress | Row opacity `.45→1` | `400ms` desktop | Standard |
| Diagram leader | Intersection | Dashed line height `0→target` | `1150ms`, `200ms` delay | Enter |
| Dashed-line march | While visible | Repeating dash offset | `700ms` infinite | Linear |
| Gauge fill | Intersection | Width `0→value` | `1550ms` | Enter |
| Neutral gauge shimmer | After fill | Horizontal sheen pass | `2500ms` infinite | Ease-in-out |
| Solar callout | Intersection | Earth scale, ring draw, tick draw, label write | Approx. `1.4s` sequence | Enter |
| Expanded wordmark | Intersection | Words rise `6px`; paths scale `.94→1` | `550–620ms`; words `140ms` apart; paths `32ms` apart | Enter |
| Scroll-scrub video | Scroll | Frame maps to normalized section progress | Continuous | Linear mapping with smoothing |

### 5.3 Scroll-driven scenes

#### Macro-scale sequence

- Desktop shell: `min-height: 340vh`.
- Sticky stage: `top: 0; height: 100vh`.
- Crossfade or scrub between media segments while the text and scale table remain anchored near the bottom.
- Use the active scale row as a synchronized textual indicator of visual progress.
- On tablet/mobile (`≤980px`), compress the track to `100svh + 42svh`; keep the stage sticky for a shorter interaction.

#### Output-size comparison

- Desktop/tablet scroll shell: `300vh`.
- Sticky stage: `100vh`, vertically centered.
- Media: contained `16:9` frame on black.
- Use container query units for annotations so labels remain attached to objects.
- At `≤560px`, remove pinning and keep the scrubbed video in normal flow to avoid excessive blank space and scroll trapping.

### 5.4 Gradients, grids, and ambient light

- **Hero:** two-axis black scrim; optional `0 2px 28px rgba(0,0,0,.4)` text shadow.
- **Sticky scenes:** bottom-heavy scrim so annotations remain readable while the upper image stays open.
- **Section seams:** transparent-to-black gradient, never a visible hard cut.
- **Navigation:** four masked blur bands with decreasing blur and tint.
- **Structural grid:** one-pixel vertical lines in `#141414–#1F1F1F`; selected lines may be dashed.
- **Footer field:** subtle canvas-rendered dot or grid field at roughly `.94` layer opacity, then masked at the top.
- **Solar glow:** warm radial gradient blurred around `38px`; only use where a luminous source exists in the scene.
- **Noise:** No strong noise texture is central to the observed design. If added, keep monochrome grain below `2–3%` opacity and disable it behind small text.
- **Glow:** Avoid generic blue/purple neon around cards and buttons. Glows should originate from content such as the Sun, a gauge endpoint, or an illuminated facility.

### 5.5 Graphic asset direction

- **Hero:** 16:9 or wider cinematic looping video, muted, autoplay, `object-fit: cover`.
- **Infrastructure/factory:** High-resolution realistic visualization or photography, heavily art-directed for text-safe negative space.
- **Scale diagrams:** Photoreal or clean grayscale composites on black, with HTML/SVG annotations layered above.
- **Product tiles:** High-detail product renders with consistent crop, lighting, and perspective; `3:4` frame.
- **Logos:** SVG, single-color, initially around `55–90%` opacity; full opacity on hover.
- **Scientific markers:** Inline SVG paths with draw-on animation; small HTML tooltips for semantic accessibility.
- **Footer:** Small procedural canvas effect is acceptable, but it must not carry essential information.
- **Mobile media:** Supply dedicated mobile video encodes and posters; do not rely only on cropping the desktop asset.

### 5.6 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }

  html { scroll-behavior: auto; }

  .reveal,
  .heading,
  .statement {
    opacity: 1 !important;
    transform: none !important;
  }

  .scroll-scrub-stage {
    position: static;
    height: auto;
  }
}
```

- Show a meaningful static poster instead of freezing on an arbitrary video frame.
- Make every scroll-linked textual state visible or provide a compact static summary.
- Remove navbar backdrop blur and substitute a simple black-to-transparent gradient.
- Preserve comprehension when all stagger and drawing effects are disabled.

---

## 6. UX Patterns & Content Architecture

### 6.1 Information hierarchy

Use this order within most sections:

1. Optional **kicker** for context.
2. One **large claim** in lightweight display type.
3. One **visual proof**: media, diagram, comparison, or scale sequence.
4. Up to three **supporting points** or a compact evidence list.
5. One **CTA**, only when the user has enough context to act.

Avoid the common landing-page pattern of eyebrow + headline + paragraph + three cards in every section. Vary the information format while preserving alignment, typography, and spacing.

### 6.2 Hero blueprint

- Fixed transparent/frosted navigation.
- Full-width looping media with a strong left and bottom scrim.
- H1: one short proper name or mission phrase, ideally under `18` characters or `2` lines.
- Supporting line: up to `45–60` characters, capped at `22ch` desktop and `18ch` mobile.
- Actions: one primary and one secondary; keep labels to `1–3` words.
- Proof row: two to three partner/customer marks after an `80–150px` visual pause.
- End the media with a black fade so the next section appears to emerge from the same scene.

### 6.3 Chunking complex technical information

#### Progressive scale model

- Use three to five ordered tiers.
- Keep the tier label short (`Type I`, `Stage 02`, `Class C`).
- Limit descriptions to one line on desktop and two on mobile.
- Synchronize only one active tier with the visual state.
- Preserve the full list in the DOM so the concept remains readable without motion.

#### Evidence matrix

- Place the source/brand/project identifier in the first three columns.
- Split evidence into two balanced groups rather than a dense card.
- Keep each proof point under roughly `75` characters where possible.
- Do not truncate; wrap naturally and expand the row.

#### Large-stat block

- Use no more than three primary metrics.
- Pair each metric with a plain-language explanation below it.
- Keep the number and unit on one line (`white-space: nowrap`).
- Use tabular numerals for changing or compared values.
- Place the accompanying physical diagram on the opposite side, not inside each metric.

#### Product/output mosaic

- Desktop: four items in one row.
- Tablet/mobile: two columns.
- Keep names to one line; use an expanded uppercase badge for machine identifiers.
- Captions may wrap to two lines; never ellipsize a product name.
- Maintain consistent crop and aspect ratio even when source assets differ.

#### Side-by-side strategic comparison

- Two equal columns with the baseline option first and preferred option second.
- Number list items `01`, `02`, etc. to improve scanning.
- Use muted text for the baseline and white for the preferred option.
- Do not use green/red judgment colors; hierarchy and ordering communicate the recommendation.
- Under `560px`, stack columns with the preferred option second unless conversion testing supports reversing them.

### 6.4 Responsive behavior

| Breakpoint | Layout behavior |
|---|---|
| **Large desktop — >1180px** | Container caps at `1180px`; generous black margins; full 12-column composition |
| **Desktop — 981–1180px** | Same grid and section logic; art-directed labels may nudge inward; media remains full bleed |
| **Tablet — ≤980px** | Outer pad becomes `28px`; evidence rows stack; capacity becomes one column; product tiles become 2-up; sticky macro sequence shortens; orbital scene separates image band from black content |
| **Mobile — ≤560px** | Outer pad becomes `20px`; compare columns stack; long CTA labels switch to short labels; scroll-scrub output becomes normal flow; footer base stacks/reverses; footer heading scales down |

#### Mobile-specific visual decisions

- Keep the cinematic hero rather than replacing it with a generic static banner, but provide an efficient poster fallback.
- Allow hero headline segments to flow inline instead of forcing desktop line breaks.
- Maintain two CTAs side by side only while each remains at least `44px` tall and the labels fit.
- Hide fine scientific markers that become illegible; preserve their meaning in nearby text.
- Change complex full-bleed orbit sections into an image band followed by content on solid black.
- Remove long sticky interactions that create scroll fatigue or trap the viewport.
- Use `svh` for mobile sticky heights to account for browser chrome.

### 6.5 Navigation and conversion UX

- Keep hero actions visible in the hero; reveal compact duplicate actions in the fixed nav only after the hero begins leaving the viewport.
- Use one mission-consumption action (“Watch”, “Explore”, “Learn”) and one participation action (“Join”, “Contact”, “Build with us”).
- The fixed nav should not include a full site map. Add a menu only if the new site genuinely has multiple destinations.
- Repeat the highest-value participation CTA in the footer after the narrative conclusion.

### 6.6 Loading, failure, and slow-connection states

The reference page depends heavily on media, so resilience must be part of the design system.

- **Hero loading:** Paint black immediately, then load the poster, then start the video. Never show a white browser background or empty rectangle.
- **Below-fold media:** Lazy-load videos and high-resolution images near the viewport.
- **Video failure:** Keep the poster visible and ensure all text remains complete and readable.
- **Scroll-scrub failure:** Show a representative final frame plus static numeric annotations beneath it.
- **Canvas failure:** Omit the footer grid; do not display an error message for purely decorative effects.
- **Reduced data:** Prefer posters and disable autoplay for nonessential loops.
- **Content loading:** Avoid skeleton cards on a cinematic marketing page. Use the black background and restrained opacity fade for late-arriving assets.

### 6.7 Content limits and wrapping

| Content | Guideline |
|---|---|
| Hero title | 1–2 lines; `≤18ch` preferred |
| Hero support | 2–3 lines; `≤22ch` desktop, `≤18ch` mobile |
| Section H2 | 1–3 lines; `16–22ch` |
| Statement | `≤24ch`, natural wrapping, no truncation |
| Kicker | One short line, ideally `≤28` characters |
| CTA | 1–3 words; never wrap |
| Nav link | 1–2 words; never wrap |
| Evidence point | Natural wrap; no ellipsis |
| Numeric value | Number + unit on one line |
| Product/model name | One line; shorten at source rather than truncating |

### 6.8 Accessibility requirements

- Use semantic `header`, `nav`, `main`, `section`, `article`, `figure`, and `footer` landmarks.
- Maintain one H1 and a logical H2/H3 hierarchy.
- Provide descriptive `alt` text for informative diagrams; use empty alt text for decorative media.
- Give scrubbed comparisons a full text alternative in the DOM.
- Autoplay video must be muted, inline, and nonessential to understanding.
- Ensure video controls are keyboard operable when the video is user-triggered.
- Global focus: at least `1–2px` visible light outline with `4px` offset.
- Preserve DOM focus order independently of visual grid placement.
- Maintain `44 × 44px` minimum touch targets, even where the visual button appears smaller.
- Provide `prefers-reduced-motion` fallbacks for every scroll or intersection-driven effect.
- Do not hide required information at tertiary `40%` opacity.
- Treat the final composite of text, scrim, and moving image as the contrast target.

### 6.9 Recommended component inventory

```text
AppShell
├── ProgressiveFrostNav
│   ├── RetractableWordmark
│   └── NavActions
├── CinematicHero
│   ├── BackgroundMedia
│   ├── MediaScrim
│   ├── HeroCopy
│   ├── CTAGroup
│   └── ProofLogoRow
├── EditorialStatement
├── ScrollScaleStage
│   ├── StickyMedia
│   ├── ScaleTierList
│   └── SemanticFallback
├── FullBleedScene
│   ├── BackgroundMedia
│   ├── LocalScrim
│   ├── SceneCopy
│   └── TechnicalCallout
├── EvidenceMatrix
├── CapacityStats
├── AnnotatedScaleDiagram
├── ScrollComparisonStage
├── ProductMosaic
├── StrategicComparison
├── FrontierCTA
└── AtmosphericFooter
```

### 6.10 Production token starter

```css
:root {
  /* Color */
  --bg: #000000;
  --text: #EDEDEE;
  --text-heading: #FFFFFF;
  --text-secondary: rgba(237, 237, 238, 0.62);
  --text-tertiary: rgba(237, 237, 238, 0.40);
  --line: rgba(255, 255, 255, 0.13);
  --line-strong: rgba(255, 255, 255, 0.24);
  --guide: #1F1F1F;
  --guide-soft: #1A1A1A;
  --guide-faint: #141414;
  --accent-energy: #FF6A28;

  /* Type */
  --font-body: "Inter", system-ui, sans-serif;
  --font-heading: "Inter Tight", "Inter", system-ui, sans-serif;
  --font-expanded: "Unbounded", "Archivo Expanded", "Space Grotesk", sans-serif;
  --heading-weight: 300;

  /* Layout */
  --container: 1180px;
  --page-pad: 48px;
  --section-pad: clamp(80px, 13vh, 170px);

  /* Shape */
  --radius-control: 2px;
  --radius-badge: 4px;

  /* Motion */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-hover: 220ms;
  --duration-reveal: 800ms;
}

@media (max-width: 980px) {
  :root { --page-pad: 28px; }
}

@media (max-width: 560px) {
  :root { --page-pad: 20px; }
}
```

---

## Final Art-Direction Checklist

- [ ] The interface remains monochrome outside content-driven accents.
- [ ] Every section has one dominant idea and one dominant visual.
- [ ] Headings use a light condensed/tight grotesque, not a heavy tech display font.
- [ ] All major text aligns to the same 12-column rails.
- [ ] Section boundaries dissolve through black gradients.
- [ ] Cards, radii, shadows, and glows are used sparingly.
- [ ] Motion explains scale, progression, or state.
- [ ] Sticky scenes have static and reduced-motion equivalents.
- [ ] Mobile layouts shorten or unpin complex interactions.
- [ ] Media has posters, art-directed crops, and legibility scrims.
- [ ] Primary CTAs remain off-white with near-black text.
- [ ] The final implementation uses original branding, copy, and media.

---

## Source Reference

- [Terafab live website](https://terafab.ai/)
- [Terafab public stylesheet](https://terafab.ai/styles.css)

