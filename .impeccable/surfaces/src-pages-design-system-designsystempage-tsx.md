---
version: 1
slug: "src-pages-design-system-designsystempage-tsx"
primary_target: "src/pages/design-system/DesignSystemPage.tsx"
related_targets: ["src/routes/designSystemRoute.tsx"]
---

# Voynan design system page

- **Scope and mode:** Internal `/design-system` surface in Read mode, enabled only in development or an explicit preview build. It helps maintainers understand and pressure-test the visual foundation before narrative pages are composed.
- **Audience and job:** Designers and developers must navigate eight named specimens, compare tokens with live production components, and discover accessibility or responsive defects without consulting private implementation state.
- **Approved direction:** “Instrument Bench,” approved from `.impeccable/mocks/design-system-instrument-bench.png`. A compact horizontal sticky index leads into full-width specimen bands that alternate calibrated reference rows with generous live stages. The memorable sequence is the color calibration strip flowing into the full typography ramp and production controls bench.
- **Implementation fidelity:** Preserve the mockup topology, density, thin-rule grammar, left alignment, almost-square corners, and strong type hierarchy. Do not literalize its invented logo, green/blue/red semantic palette, unsupported controls, or any sample that implies product facts. Navy, ivory, slate, and copper remain the complete UI palette.
- **Responsive behavior:** Desktop uses the full bench width; tablet preserves a horizontally scrollable sticky index and reduces specimen columns; mobile returns every specimen to one readable column with ordinary document flow and 44px controls.
- **Constraints:** One `h1`; eight `section` regions; no public navigation, prerender, canonical, hreflang, sitemap, or social metadata; `noindex,nofollow`; real production primitives only; Media and Motion remain contracts until their owning tasks land. Future form states extend the existing page rather than creating a duplicate specimen system.
