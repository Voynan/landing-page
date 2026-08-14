---
name: Voynan
description: Building Digital Products
colors:
  navy: "#0e1524"
  navy-deep: "#090d18"
  navy-raised: "#16203a"
  navy-hover: "#1d2a49"
  ivory: "#f4f1ea"
  slate: "#8a93a6"
  slate-muted: "rgb(138 147 166 / 68%)"
  copper: "#c77b3a"
  copper-light: "#dba265"
  line: "rgb(244 241 234 / 13%)"
  line-strong: "rgb(244 241 234 / 24%)"
  grid: "rgb(244 241 234 / 3.5%)"
  destructive: "#ef8c83"
typography:
  hero:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(2.6rem, 6.2vw, 5.5rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  statement:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(1.8rem, 4vw, 3.4rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(2.1rem, 4.2vw, 3.8rem)"
    fontWeight: 300
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(1.45rem, 2.4vw, 2.1rem)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  statistic:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(2.5rem, 5vw, 4.8rem)"
    fontWeight: 300
    lineHeight: 1
  body:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "clamp(1rem, 1.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  kicker:
    fontFamily: '"Poppins", "Avenir Next", "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    lineHeight: 1.5
  code:
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
    fontSize: "clamp(0.78rem, 1vw, 0.9rem)"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.125rem"
  md: "0.25rem"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-6: "1.5rem"
  space-8: "2rem"
  space-12: "3rem"
  space-16: "4rem"
  space-24: "6rem"
  page-pad-desktop: "3rem"
  page-pad-tablet: "1.75rem"
  page-pad-mobile: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.navy-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.copper-light}"
    textColor: "{colors.navy-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  button-secondary:
    backgroundColor: "{colors.navy-raised}"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.navy-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.copper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
  label:
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
  skip-link:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.navy-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
  live-region:
    textColor: "{colors.slate}"
    typography: "{typography.body-small}"
  design-system-index:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.slate}"
    typography: "{typography.label}"
  design-system-index-active:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
---

# Design System: Voynan

## Overview

**Creative North Star: "Quiet Orbital Precision"**

Quiet Orbital Precision describes the visual world already established in code: deep navy fields, manuscript-toned ivory, measured spacing, thin structural rules, and a copper signal used with restraint. The atmosphere is editorial and cinematic, but the interface remains quiet enough for product evidence and technical content to lead.

Precision comes from a disciplined grid, light geometric type, compact geometry, and state changes that explain progress rather than decorate it. The eclipse idea may organize transformation and continuity, while every essential message, order, and action remains complete without motion.

On internal reference surfaces, this same world resolves into a dense “Instrument Bench”: compact section headers, thin calibration rules, and live production specimens arranged for comparison rather than presentation. This is a documentation expression of Quiet Orbital Precision, not a default composition for public narrative pages.

**Key Characteristics:**

- Deep navy-to-navy tonal fields with manuscript ivory text.
- Copper reserved as the single signature accent.
- Light geometric editorial type paired with restrained technical mono.
- Predominantly left-aligned 12/8/4-column structure.
- Motion expresses state or transformation and always has a static equivalent.
- Internal reference surfaces favor dense calibration bands and live specimens over dashboard chrome or card catalogs.

## Colors

The palette is a compact dark system: tonal navies establish hierarchy, ivory carries content, and copper acts as the only signature accent.

### Primary

- **Signature Copper** (#c77b3a): Marks primary actions, selection, focus relationships, and the eclipse signature; its rarity is part of the identity.
- **Light Copper** (#dba265): Provides the implemented hover and focus-adjacent lift within the same accent family.

### Neutral

- **Deep Navy** (#090d18): Immediate page paint and deepest background field.
- **Structural Navy** (#0e1524): Default card, popover, and brand surface.
- **Raised Navy** (#16203a): Secondary and muted surface layer.
- **Hover Navy** (#1d2a49): Tonal response for raised interactive surfaces.
- **Manuscript Ivory** (#f4f1ea): Primary text and foreground; replaces pure white.
- **Blue Slate** (#8a93a6): Secondary text, captions, and live-region output.
- **Muted Blue Slate** (rgb(138 147 166 / 68%)): Lower-emphasis supporting text.
- **Ivory Rule** (rgb(244 241 234 / 13%)): Subtle borders and dividers.
- **Strong Ivory Rule** (rgb(244 241 234 / 24%)): Higher-emphasis input and structural boundaries.
- **Atmospheric Ivory Grid** (rgb(244 241 234 / 3.5%)): Very subtle decorative grid.

### Functional

- **Destructive** (#ef8c83): Error and destructive action state, paired with the deepest navy foreground.

On internal foundation specimens, each canonical swatch is accompanied by its token name, value, function, and approved pairing. The implemented contrast ledger records ivory on deep navy at 17.20:1, slate on deep navy at 6.29:1, copper with deep navy at 5.84:1, light copper on deep navy at 8.66:1, and destructive on deep navy at 8.08:1. A semantic ruler marks 0, 25, 50, 75, and 100 over CSS-drawn ticks so the calibration grammar remains selectable and responsive rather than becoming an image.

### Named Rules

**The One Accent Rule.** Copper is the only interface accent, and it must not compete simultaneously across the eclipse thread, multiple headings, and multiple controls in one composition.

**The Measured Pairing Rule.** A canonical swatch is documented with function and pairing; accessibility claims come from measured contrast, never palette intuition.

## Typography

**Display Font:** Poppins (with Avenir Next, Segoe UI, and sans-serif fallbacks)

**Body Font:** Poppins (with Avenir Next, Segoe UI, and sans-serif fallbacks)

**Technical/Mono Font:** JetBrains Mono (with SFMono-Regular, Consolas, and monospace fallbacks)

**Character:** Poppins supplies quiet geometric authority through light weight, scale, and space rather than heaviness. JetBrains Mono appears only where technical context, code, or identifiers benefit from an engineering register.

### Hierarchy

- **Hero** (Poppins, weight 300, fluid hero token, line-height 0.98): The largest primary message, balanced and limited to a compact measure.
- **Statement** (Poppins, weight 300, fluid statement token, line-height 1.12): Editorial thesis copy with a calmer rhythm than the hero.
- **Headline** (Poppins, weight 300, fluid headline token, line-height 1.03): Chapter-level headings in sentence case.
- **Title** (Poppins, weight 300, fluid title token, line-height 1.15): Product and group headings that remain clearly subordinate to chapters.
- **Statistic** (Poppins, weight 300, fluid statistic token, line-height 1): Large verified figures only; never a license to invent proof.
- **Body** (Poppins, weight 400, fluid body token, line-height 1.6): Primary reading text with a maximum measure of 70ch.
- **Label** (Poppins, weight 500, 0.875rem, line-height 1.25rem): Interface text; kicker-sized text is reserved for short indices and context.
- **Code** (JetBrains Mono, weight 400, fluid code token, line-height 1.6): Real technical content and technical states.

### Named Rules

**The Precision-Through-Type Rule.** Authority comes from light weight, generous scale, exact alignment, and restrained line length; avoid heavy display type and decorative font mixing.

## Layout

The layout uses a centered maximum container of 1180px (73.75rem) and a predominantly left-oriented grid. Above 980px the base grid has 12 columns with 48px page padding; at 980px and below it becomes 8 columns with 28px padding; at 560px and below it becomes 4 columns with 20px padding. The implemented spacing rhythm is a quarter-rem-based scale that expands from 4px through 96px.

Responsive composition becomes progressively more linear as space narrows. Mobile keeps content in ordinary document flow, protects a minimum viewport width of 320px, and preserves at least 44 × 44px for interactive targets.

Internal design-system reference surfaces may use the implemented wider shell of 1440px (90rem) to compare instruments without shrinking their evidence. Their specimen bands use compact two-part headers—section name followed by explanatory copy—and fine horizontal rules; tablet reduces multi-column benches, while mobile returns every specimen to one readable column.

The internal section index remains sticky and horizontal. Its links are at least 44px high, expose the current location through `aria-current="location"`, and use an ivory label with a copper underline for active, hover, and keyboard-focus states. Horizontal overflow remains directly scrollable on narrow screens so the index never wraps into a tall control block or clips destinations.

### Named Rules

**The Instrument, Not Dashboard Rule.** Internal reference surfaces use dense full-width calibration bands and live stages, not card catalogs, bento grids, or dashboard chrome.

## Elevation & Depth

Depth is tonal and flat on editorial and reference surfaces. Deep navy, structural navy, raised navy, hover navy, fine borders, and a very subtle grid separate bands and states without simulating physical lift; transient production overlays retain their own established elevation behavior.

### Named Rules

**The Tonal Depth Rule.** Build hierarchy with adjacent navy tones and structural rules; editorial content remains shadow-free.

## Shapes

The form language is compact and precise: small corners of 2px and 4px, 1px structural borders, and uncluttered silhouettes. Controls use the existing small-radius vocabulary; repeated soft cards, pills, and oversized rounded containers are not part of the foundation.

### Named Rules

**The Compact Geometry Rule.** Corners stay nearly square so spacing, alignment, and the eclipse curve provide the visual character.

## Components

The implemented component layer is deliberately small: one button system, a form label, the production sheet, a keyboard skip link, and an assistive live region. Internal specimens render these production primitives directly; the native field remains native until a shared input component exists.

### Buttons

- **Shape:** Compact rounded rectangle with transparent 1px border and a minimum 44 × 44px target.
- **Primary:** Copper surface with deep navy text; light copper is the hover state.
- **Outline:** Transparent surface with an ivory rule and ivory text; hover moves both border and text to copper.
- **Secondary:** Raised navy surface with ivory text; hover uses hover navy.
- **Ghost:** Transparent at rest; hover introduces the muted raised navy.
- **Destructive:** Destructive surface with deep navy text; hover reduces opacity.
- **Link:** Copper text with an underline on hover, while retaining the shared touch target.
- **Sizes:** Existing text and icon sizes preserve the same 44px minimum; the large size raises the minimum height to 48px.
- **Hover / Focus / Active:** Color, background, border, opacity, and transform transition over 220ms with the standard easing. Keyboard focus uses a 2px light-copper outline offset by 4px; press translates down by 1px when the control is not a popup trigger.
- **Disabled / Invalid:** Disabled controls block pointer events and use 45% opacity. Invalid controls receive the destructive border and ring treatment.

### Label

- **Style:** Poppins medium at the implemented small interface size, ivory foreground, 8px internal gap, and 20px line height.
- **Disabled:** The component follows its disabled group or peer with 45% opacity and suppressed interaction.

### Skip Link

- **Style:** A copper, small-radius control fixed 20px from the top and inline start, translated above the viewport at rest.
- **Focus:** Keyboard focus returns it to the visible position with the enter easing; reduced-motion removes the transition.

### Live Region

- **Style:** Small regular Poppins text in blue slate.
- **Semantics:** Polite status is the default; assertive messages switch to an alert. Messages are atomic and do not depend on color or motion.

### Design System Index

- **Structure:** A sticky local navigation with a single horizontal ordered list and direct section anchors.
- **State:** Slate labels at rest; active, hover, and focus states use ivory text with a copper bottom rule. The active destination is also exposed semantically with `aria-current="location"`.
- **Responsive behavior:** The list preserves one tactile horizontal track with direct overflow scrolling on mobile instead of wrapping or collapsing into dashboard navigation.

### Specimen Contracts

- **Foundations:** Canonical token swatches include value, function, and pairing, followed by measured contrast results and a semantic calibration ruler.
- **Production components:** Controls and later specimens import the real production primitives. They do not maintain demonstration-only copies or substitute screenshots for operable controls.
- **Media:** The specimen renders the production `ProductMedia` primitive in poster, loading, ready, error, and reduced-data states. A neutral Voynan fixture verifies poster-first loading, silent fallback, and responsive behavior without impersonating a product screenshot or generating substitute product imagery.
- **Motion:** The initial specimen documents the existing 220ms hover, 400ms navigation, 760ms reveal, and 1100ms transform durations together with both implemented easing curves. It begins from static content and does not imply GSAP, ScrollTrigger, or narrative motion before those owning tasks land.

Motion-sensitive elements use explicit `data-motion="reveal"`, `data-motion="scrub"`, or `data-motion="transform"` contracts. Under reduced motion they expose the final visible state, remove transforms, animation, transition, and smooth scrolling, and preserve the same content and actions.

## Do's and Don'ts

### Do:

- Do use ivory instead of pure white for foreground content.
- Do reserve copper for one dominant accent relationship per composition.
- Do create hierarchy with the implemented navy tones, 1px rules, grid, spacing, and type scale.
- Do preserve full content, order, focus access, and actions when reduced motion is active.
- Do keep interactive targets at least 44 × 44px and keyboard focus visibly outlined.
- Do document canonical colors with function, pairing, and measured contrast before making accessibility claims.
- Do use production components in specimens; where implementation does not yet exist, document an honest contract instead of a visual clone.
- Do keep an internal horizontal section index touch-scrollable and expose its active destination with both copper treatment and `aria-current`.

### Don't:

- Don't introduce a second interface accent or blue/purple neon gradients.
- Don't use elevation shadows on editorial content.
- Don't turn the system into repeated rounded cards, pills, glass panels, or generic floating dashboards.
- Don't use product-specific colors outside approved product screenshots, videos, or product-owned assets.
- Don't communicate state through color, position, or motion alone.
- Don't treat an internal design reference as a dashboard, bento layout, or catalog of floating cards.
- Don't use screenshots in place of production controls, fabricate product media, or animate a contract beyond the behavior already implemented.
