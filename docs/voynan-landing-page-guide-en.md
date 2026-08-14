# Voynan — Initial Landing Page Guide

> Strategic, narrative, visual, editorial, and functional direction for Voynan's first landing page.
>
> Version 1.0 — August 2026

## 1. Purpose of this document

This guide turns the cinematic visual system described in `terafab-inspired-ux-ui-design-system.md` and the identity defined in `voynan-brand-guide.md` into an original experience for Voynan.

The document guides design, copywriting, content, motion, and implementation. It must not be treated as a structural or visual copy of Terafab. The reference provides principles—scale, continuity, editorial restraint, and purposeful motion—while the colors, symbol, typography, narrative, media, and components belong to Voynan.

### 1.1 Business goals, in priority order

1. Drive visitors to the three SaaS products currently in production.
2. Generate qualified leads for custom software development.
3. Position Voynan as a product studio capable of creating, launching, operating, and evolving digital products.
4. Demonstrate technical contribution through Aegis, an open-source project approaching release.

### 1.2 Desired perception

> Voynan creates and operates its own products—and applies that experience to building products with its clients.

The page must communicate the ability to handle complex systems without suggesting that the company works only on large projects. Trust should come primarily from products in production, results, clients, and engineering quality.

### 1.3 Primary conversions

- **Explore our products:** lead visitors to the portfolio and the SaaS websites.
- **Build with us:** lead visitors to the short contact form.
- **Explore Aegis:** lead visitors to GitHub and the documentation.

---

## 2. Priority audiences

### 2.1 Product users

- People and organizations that need to protect files and prove their integrity.
- Investors and shareholders of every size in Brazil, the United States, and Canada.
- Brazilian builders and construction companies that need to manage project costs, taxes, and reporting.

### 2.2 Custom software clients

Founders and companies that need to create, modernize, integrate, automate, or evolve a digital product. The scope may be small or complex; the messaging must not impose a minimum project size.

### 2.3 Technical community

Developers looking for a straightforward library for authenticated encryption of files of any format or size.

---

## 3. Core creative concept

### 3.1 The idea: Eclipse thread

Voynan's most distinctive symbol stops being merely a signature and begins organizing the experience. The eclipse ring starts complete in the hero, opens into a continuous line, and accompanies the visitor throughout the page.

The thread should take on different functions:

| Chapter | Thread behavior |
|---|---|
| Hero | Complete ring; opens when the visitor begins scrolling |
| Thesis | Vertical line that reveals the editorial statement |
| Products | Orbit and progress indicator across the three SaaS products |
| Credibility | Connects metrics, quotes, and the sources of evidence |
| Services | Becomes a flow of building, integration, and operation |
| Aegis | Takes the form of a cryptographic flow or line of code |
| Founder | Contracts into a signature stroke |
| Contact | Closes into a complete ring again |

The thread must never exist as ornament alone. It must indicate progress, connection, transformation, or state.

### 3.2 Experience direction

- Cinematic and editorial, with conversions easy to find.
- Each viewport should have one dominant idea.
- Sections should feel like chapters in the same argument, not independent modules.
- Real product media replaces generic mockups.
- Motion should explain relationships and change.
- The interface remains restrained; the content provides variety.

### 3.3 What to avoid

- Repeated rounded cards in every section.
- Abstract spheres, glowing brains, and other AI visual clichés.
- Blue or purple neon gradients.
- Floating dashboards unrelated to the real products.
- Glassmorphism outside the navigation.
- Generic rows of colorful icons.
- Auto-advancing testimonial carousels.
- Continuous motion without a narrative purpose.
- Unsupported superlative language such as “infallible,” “unbreakable,” or “absolute legal guarantee.”

---

## 4. Voynan's visual system applied to the web

### 4.1 Color palette

The pure black from the Terafab reference should be adapted to Voynan's natural visual habitat.

```css
:root {
  --color-bg-primary: #0E1524;
  --color-bg-deep: #090D18;
  --color-bg-raised: #16203A;

  --color-text-primary: #F4F1EA;
  --color-text-secondary: #8A93A6;
  --color-text-tertiary: rgba(138, 147, 166, 0.68);

  --color-accent: #C77B3A;
  --color-accent-light: #DBA265;

  --color-line: rgba(244, 241, 234, 0.13);
  --color-line-strong: rgba(244, 241, 234, 0.24);
  --color-grid: rgba(244, 241, 234, 0.035);
}
```

Rules:

- Ivory replaces pure white.
- Copper is the interface's only accent color.
- When copper drives the eclipse thread, it should not be repeated across multiple headings and controls in the same composition.
- Product-specific colors appear only inside screenshots, videos, or the products' own assets.
- Sections dissolve between deep navy and dark navy; avoid abrupt cuts.

### 4.2 Typography

```css
:root {
  --font-brand: "Poppins", system-ui, sans-serif;
  --font-technical: "JetBrains Mono", ui-monospace, monospace;
}
```

- **Headings and statements:** Poppins Light, weight 300.
- **Body and interface text:** Poppins Regular, weights 400–500.
- **Code, technical states, and identifiers:** JetBrains Mono Regular.
- Use sentence case for headings, with light weight and generous scale.
- Use uppercase only for short technical identifiers.
- Avoid excessively heavy headings; authority comes from scale, space, and precision.

Initial scale:

| Role | Fluid size | Line height | Use |
|---|---:|---:|---|
| Hero | `clamp(2.6rem, 6.2vw, 5.5rem)` | `0.98` | Primary message |
| Statement | `clamp(1.8rem, 4vw, 3.4rem)` | `1.12` | Editorial thesis |
| H2 | `clamp(2.1rem, 4.2vw, 3.8rem)` | `1.03` | Chapters |
| H3 | `clamp(1.45rem, 2.4vw, 2.1rem)` | `1.15` | Products and groups |
| Statistic | `clamp(2.5rem, 5vw, 4.8rem)` | `1` | Verified metrics |
| Body | `clamp(1rem, 1.2vw, 1.125rem)` | `1.6` | Primary text |
| Kicker | `0.75rem` | `1.5` | Indices and context |
| Code | `clamp(0.78rem, 1vw, 0.9rem)` | `1.6` | Aegis |

### 4.3 Grid and form

- Maximum container width: `1180px`.
- Desktop: 12 columns.
- Tablet: 8 conceptual columns.
- Mobile: 4 conceptual columns.
- Horizontal padding: `48px`, `28px`, and `20px`.
- Radii: `2px` on controls and no more than `4px` on technical badges.
- No elevation shadows on editorial content.
- Use `1px` structural rules and very subtle grids.
- Alignment is predominantly left-oriented.

### 4.4 Media

- Use real screenshots, recordings, and visual identities from CryptoVault, InvestFusion, and Constrully.
- Keep the product legible; do not tilt screens merely to create dynamism.
- Use art-directed crops with negative space for copy.
- Prepare a poster and mobile version for every video.
- Do not simulate an interface for Aegis; use its logo, real code, GitHub, and documentation.

---

## 5. Narrative architecture

```text
Progressive navigation
└── Hero — product studio promise
    └── Thesis — operating products changes how we build
        └── SaaS portfolio
            ├── CryptoVault
            ├── InvestFusion
            └── Constrully
                └── Credibility — metrics + testimonials
                    └── Custom software
                        └── Aegis — open source / coming soon
                            └── Founder note
                                └── Contact
                                    └── Footer
```

### 5.1 Rhythm

1. **Impact:** cinematic hero.
2. **Clarity:** short editorial thesis.
3. **Demonstration:** three product chapters.
4. **Proof:** metrics and real voices.
5. **Conversion:** custom development capabilities.
6. **Openness:** open-source contribution.
7. **Humanity:** founder note.
8. **Action:** contact and alternatives.

---

## 6. Section specifications

### 6.1 Progressive navigation

#### Content

- Voynan wordmark.
- Products.
- Open source.
- Build with us.
- `PT / EN` language switch.

#### Behavior

- At the top, show the full wordmark over a transparent background.
- After the hero, retract the wordmark into the eclipse icon.
- Reveal the links with a short transition and no large displacement.
- The “Build with us” CTA remains accessible throughout the narrative.
- On mobile, show the icon, language control, and compact menu.
- Switching languages preserves the current section.

#### Accessibility

- Full keyboard navigation.
- Visible focus state.
- Skip-to-content link.
- Announce the menu's open/closed state with `aria-expanded`.

---

### 6.2 Hero

#### Goal

Present Voynan as a product studio and immediately offer the two primary paths.

#### Initial copy — Portuguese

**Kicker:** `Voynan / Product studio`

**Title:**

> Construímos produtos digitais. Para nós. Para você.

**Support:**

> Produtos SaaS próprios e engenharia de software para transformar ideias em sistemas que operam no mundo real.

**CTAs:**

- Conheça os produtos
- Construa conosco

**Context line:**

> 3 SaaS em produção · 1 projeto open source a caminho · desenvolvimento de ponta a ponta

#### Initial copy — English

**Kicker:** `Voynan / Product studio`

**Title:**

> We build digital products. For us. For you.

**Support:**

> Our own SaaS products and software engineering that turn ideas into systems built for the real world.

**CTAs:**

- Explore our products
- Build with us

**Context line:**

> 3 SaaS products in production · 1 open-source project on the way · end-to-end development

#### Visual

- Hero approximately `100svh` tall.
- Monumental eclipse ring, partially outside the frame.
- Real fragments from the three products appear as signals inside or around the ring.
- Scrolling opens the ring and starts the eclipse thread.
- A navy scrim preserves legibility across every frame.

---

### 6.3 Studio thesis

#### Initial copy — Portuguese

> Não apenas entregamos software. Nós o lançamos, operamos e evoluímos. É essa experiência que levamos para cada projeto.

#### Initial copy — English

> We do more than deliver software. We launch it, run it and evolve it. That experience shapes every project we build.

#### Behavior

- A low-density visual pause.
- Words or phrases gain contrast as the thread passes through them.
- No CTA; the section exists to set up the proof.
- The complete sentence remains available in the HTML even without motion.

---

### 6.4 SaaS portfolio

#### Structure

On desktop, the three products share a sticky stage. Content advances in three acts while the media transforms within the same frame. Each act must receive equal visual time.

On mobile, remove the long pinned stage: each product becomes a chapter in normal document flow, with its own screenshot or video.

Each product includes:

- Index and category.
- Primary benefit.
- Up to three capabilities.
- Real media.
- Product CTA.
- Descriptive alternative text.

#### 6.4.1 CryptoVault

**Kicker:** `01 / SaaS`

**Portuguese — title:**

> Proteja arquivos. Comprove sua integridade.

**Portuguese — support:**

> Criptografia autenticada, validação de integridade e registro verificável para arquivos que não podem depender apenas da confiança.

**Capabilities:**

- AES-GCM encryption.
- Integrity validation.
- Verifiable blockchain record.

**English — title:**

> Protect files. Prove their integrity.

**English — support:**

> Authenticated encryption, integrity validation and verifiable records for files that cannot rely on trust alone.

**CTA:** `Conhecer o CryptoVault / Explore CryptoVault`

**Claims rule:** do not publish “infallible,” “unbreakable,” or “guaranteed legal proof.” Every legal claim must be reviewed for the jurisdiction in which it will appear.

#### 6.4.2 InvestFusion

**Kicker:** `02 / SaaS`

**Portuguese — title:**

> Seus investimentos, além da planilha.

**Portuguese — support:**

> Acompanhe ativos no Brasil, Estados Unidos e Canadá, gere relatórios e transforme dados dispersos em decisões mais claras.

**Capabilities:**

- Investment tracking across three markets.
- Reports and insights.
- Organization of information for income tax reporting.

**English — title:**

> Your investments, beyond spreadsheets.

**English — support:**

> Track assets across Brazil, the United States and Canada, generate reports and turn scattered data into clearer decisions.

**CTA:** `Conhecer o InvestFusion / Explore InvestFusion`

**Claims rule:** content must be presented as data organization and analysis, without promising financial advice or investment outcomes.

#### 6.4.3 Constrully

**Kicker:** `03 / SaaS`

**Portuguese — title:**

> Cada custo da obra, sob controle.

**Portuguese — support:**

> Gerencie gastos, acompanhe impostos e gere relatórios para tomar decisões com uma visão atualizada de cada obra.

**Capabilities:**

- Expense management and tracking.
- Tracking of construction-related taxes.
- Operational and tax reports.

**English — title:**

> Every construction cost, under control.

**English — support:**

> Manage expenses, track taxes and generate reports with an up-to-date view of every construction project.

**CTA:** `Conhecer o Constrully / Explore Constrully`

**Claims rule:** review Brazilian tax terminology and clarify when the platform organizes information without replacing professional accounting advice.

#### Relationship between chapters

- No SaaS product receives a “primary” badge.
- Use exactly the same screen time, typographic scale, and CTA weight for each product.
- The order demonstrates range: security, financial intelligence, and construction operations.
- The eclipse thread connects the acts without imposing a single visual identity on the products' media.

---

### 6.5 Credibility

#### Goal

Prove Voynan's capability through evidence from both products and custom software work in a single composition.

#### Content

- Three or four verified metrics.
- Three to five testimonials in total.
- A mix of SaaS users and custom project clients.
- Name, title, and company whenever publication is authorized.
- Source identified as a product or project.

#### Testimonial structure

```text
“A concise quote describing a concrete benefit or transformation.”
Name — Title, Company
Source: Product or Project
```

#### Rules

- Do not use star ratings without a real platform or methodology supporting them.
- Do not invent metrics to fill the layout.
- Do not turn a product metric into a claim about the entire company.
- Record permission to use each name, photo, title, company, and quote.
- Avoid an auto-advancing carousel; every piece of evidence must remain accessible.

#### Visual

- Large figures aligned to the grid.
- Quotes at varied widths, separated by fine rules.
- The eclipse thread connects the proof points.
- Logos may be monochrome and understated when their use is authorized.

---

### 6.6 Custom software

#### Goal

Turn the experience of operating first-party products into a clear offer for clients.

#### Initial copy — Portuguese

**Kicker:** `Construa conosco`

**Title:**

> A experiência de operar nossos produtos, aplicada ao seu.

**Support:**

> Construímos projetos de todos os tamanhos — de uma automação focada a sistemas digitais complexos — com engenharia preparada para continuar evoluindo depois do lançamento.

#### Initial copy — English

**Kicker:** `Build with us`

**Title:**

> The experience of running our products, applied to yours.

**Support:**

> We build projects of every size—from focused automations to complex digital systems—with engineering designed to keep evolving after launch.

#### Capability groups

| Layer | Capabilities |
|---|---|
| **Build** | Web and mobile development |
| **Connect and automate** | APIs, integrations, automation, and AI |
| **Operate with confidence** | Cloud/DevOps, security, maintenance, and evolution |
| **Expand frontiers** | Web3 and blockchain |

#### Interaction

The thread begins as a simple intent and passes through the four layers. It gains connections, moves through validation, and ends as a system in continuous operation. The animation shows increasing complexity without suggesting that every project needs every technology.

**CTA:** `Iniciar uma conversa / Start a conversation`

---

### 6.7 Aegis — open source

#### Goal

Demonstrate openness and technical competence through a useful solution for developers.

#### Initial copy — Portuguese

**Kicker:** `Open source / Em breve`

**Title:**

> Criptografia de arquivos, sem atrito.

**Support:**

> Uma biblioteca para criptografar e autenticar arquivos de qualquer formato ou tamanho com AES-GCM, com implementação direta para desenvolvedores.

#### Initial copy — English

**Kicker:** `Open source / Coming soon`

**Title:**

> File encryption, without the friction.

**Support:**

> A library for encrypting and authenticating files of any format or size with AES-GCM, designed for straightforward implementation.

#### Technical content

- Aegis logo.
- Supported languages and environments, only when confirmed by the documentation.
- A short, real, copyable example.
- Current release status.
- Open-source license.
- GitHub.
- Documentation.

#### CTAs

- Ver no GitHub / View on GitHub
- Ler a documentação / Read the docs

#### Interaction

- The eclipse thread becomes a cryptographic flow.
- The code sample may reveal each stage as the visitor scrolls, but it must remain copyable and readable without animation.
- Do not use a fake terminal or invented command.

---

### 6.8 Founder note

#### Goal

Humanize Voynan without shifting focus away from the products.

#### Structure

- Understated, natural portrait.
- Two or three sentences.
- Full name.
- Role: Founder of Voynan.
- LinkedIn link.

#### Content direction

The note should explain that building first-party products creates responsibility for technical decisions, user experience, operations, and evolution. Voynan brings that responsibility to client work.

Avoid a long biography, an extensive list of technologies, or a “genius founder” narrative. The visual signature may use the eclipse thread contracted into a small copper stroke.

---

### 6.9 Contact

#### Initial copy — Portuguese

**Title:**

> Vamos construir algo que continue evoluindo.

**Commercial note:**

> A conversa inicial é gratuita. A maioria dos orçamentos também não tem custo. Se o seu projeto exigir uma etapa paga de diagnóstico, avisaremos antes de qualquer compromisso.

#### Initial copy — English

**Title:**

> Let’s build something that keeps evolving.

**Commercial note:**

> The initial conversation is free. Most estimates are free as well. If your project requires a paid discovery phase, we will tell you before any commitment is made.

#### Essential form

- Nome / Name.
- E-mail / Email.
- Mensagem / Message.
- `Iniciar conversa / Start a conversation` button.

#### Alternatives

- Visible email address with a copy action.
- LinkedIn.

#### Functional flow

```text
Input
→ field-level validation
→ submission to the configured endpoint
→ success in the same context

Failure
→ preserve all entered data
→ explain the issue without a technical error code
→ offer email copying as an alternative
```

#### States

| State | Behavior |
|---|---|
| Empty | Persistent labels; placeholders used only as examples |
| Invalid | Message next to the field and accessible error summary |
| Submitting | Button preserves its width and uses `aria-busy="true"` |
| Success | Confirmation within the form; redirect is not required |
| Failure | Message remains intact and the email alternative gains emphasis |
| Email copied | Icon changes temporarily and the result is announced |

#### Privacy and abuse prevention

- Short notice explaining that the data will be used to respond to the inquiry.
- No automatic marketing subscription.
- Invisible antispam protection whenever possible.
- Do not record message content in analytics tools.
- Secure transport and minimal retention according to the privacy policy.

---

### 6.10 Footer

#### Content

- Voynan wordmark or icon.
- Products: CryptoVault, InvestFusion, and Constrully.
- Open source: Aegis, GitHub, and documentation.
- Contact: email and LinkedIn.
- Português / English.
- Privacy and applicable terms.
- Founder's name, role, and LinkedIn in a compact format.
- Copyright.

The eclipse ring closes the narrative. An atmospheric grid may appear in the background as long as it remains purely decorative and does not affect performance or contrast.

---

## 7. Motion and interaction

### 7.1 Principles

- Motion explains transformation, progress, or relationships.
- One dominant animation per viewport.
- Text entrances are short and restrained.
- Avoid strong parallax on text and controls.
- Scrolling must never become trapped.
- No essential content may depend on perfect synchronization.

### 7.2 Initial tokens

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-hover: 220ms;
  --duration-nav: 400ms;
  --duration-reveal: 760ms;
  --duration-transform: 1100ms;
}
```

### 7.3 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Display the eclipse thread in static states for each section.
- Remove video scrubbing and long sticky areas.
- Show meaningful posters.
- Display all statements and evidence without progressive reveal.
- Preserve the same content, order, and CTAs.

---

## 8. Responsive behavior

### Desktop — above 1180px

- `1180px` container with generous margins.
- Sticky stage for the three SaaS products.
- Continuous eclipse thread between sections.
- Asymmetrical compositions guided by the 12-column grid.

### Desktop and tablet — 981px to 1180px

- Same narrative, with media and annotations moved closer to the center.
- Shorten the duration of sticky scenes.

### Tablet — up to 980px

- Evidence and services move to more linear layouts.
- Fewer technical annotations appear at the same time.
- Products may keep a short sticky interaction only if it does not compromise reading.

### Mobile — up to 560px

- `20px` horizontal padding.
- Products in normal flow, one per chapter.
- Videos with dedicated crop and encoding.
- Eclipse thread split into local states that remain visually continuous.
- Form and alternatives in one column.
- CTAs with a minimum touch area of `44 × 44px`.
- Aegis code with horizontal scrolling and an accessible copy action.

---

## 9. Internationalization

- Recommended routes: `/pt` and `/en`.
- The root may default to Portuguese without preventing manual selection.
- Persist the selected preference.
- Switching languages must keep the visitor in the same chapter.
- Translate labels, validation, success and failure messages, metadata, alternative text, and legal content.
- Use coherent `hreflang` and canonical URLs.
- Do not mix languages within the same content block, except for proper names and established technical terms.
- Treat English as an editorial adaptation; avoid word-for-word translation.

---

## 10. Accessibility

- One `h1`; logical `h2` and `h3` hierarchy.
- Semantic landmarks for header, nav, main, section, and footer.
- “Skip to content” link.
- WCAG 2.1 AA-compatible contrast on both the brightest and darkest frames of every video.
- Visible focus on all interactive elements.
- DOM order independent of visual composition.
- Alternative text describes what the media proves, not merely its generic appearance.
- Autoplay video is muted, inline, and nonessential.
- Every visual comparison has a text alternative.
- Metrics and testimonials must not use insufficient opacity.
- Form messages must be announced by assistive technologies.
- Do not rely on color, motion, or position alone to communicate state.

---

## 11. Performance and resilience

### Loading sequence

1. Paint `#090D18` immediately.
2. Load the essential logo and typography.
3. Display the hero poster.
4. Start video only when ready and permitted.
5. Lazy-load media below the fold.

### Rules

- Use modern image formats with an appropriate fallback.
- Provide explicit dimensions to prevent layout shifts.
- Do not download all three SaaS videos during initial loading.
- Preload the next chapter when it approaches the viewport.
- Avoid duplicate animation libraries.
- The footer canvas, if present, must be disposable.
- If a video fails, preserve its poster, title, description, and CTA.
- If JavaScript fails, primary content and links remain accessible.
- If the form fails, preserve the message and offer email as a fallback.

---

## 12. Analytics and events

Measure only actions that help evaluate the page's goals:

| Event | Trigger |
|---|---|
| `hero_product_click` | Click on “Explore our products” |
| `hero_contact_click` | Click on “Build with us” |
| `product_view` | A product becomes the active chapter |
| `product_click` | Exit to one of the SaaS products |
| `aegis_github_click` | Exit to GitHub |
| `aegis_docs_click` | Exit to the documentation |
| `contact_start` | First interaction with the form |
| `contact_submit_success` | Successful submission |
| `contact_submit_error` | Submission failure, without capturing content |
| `email_copy` | Email copied |
| `language_change` | Switch between Portuguese and English |

Do not collect form text, copied content, financial data visible in screenshots, or sensitive information from the products.

---

## 13. Component inventory

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

Each unit must work in isolation, accept its content in Portuguese or English, and provide a static state whenever motion or media is unavailable.

---

## 14. Content required before launch

External links were intentionally excluded from this version because they will be supplied later. The page must not be published until every item below is confirmed.

### Brand and company

- Final logo in SVG with typography converted to outlines.
- Founder's full name, role, portrait, and LinkedIn.
- Public contact email.
- Privacy and applicable terms URLs.

### Products

- Official URL for CryptoVault, InvestFusion, and Constrully.
- Logo, screenshots, videos, posters, and alternative text for each SaaS product.
- Confirmation of the published capabilities.
- Legal, tax, and financial review of sensitive claims.

### Aegis

- GitHub URL.
- Documentation URL.
- License.
- Release status.
- Real installation and usage example.
- Officially supported environments or languages.

### Credibility

- Verified metrics with period, definition, and source.
- Approved testimonials.
- Permission to use each name, title, company, photo, and logo.
- Approved translations or permission to translate the statements.

### Contact

- Submission endpoint.
- Message destination and responsible owner.
- Retention policy.
- Antispam solution.
- Final success and failure messages in both languages.

---

## 15. Acceptance criteria

### Strategy and content

- [ ] SaaS products and custom software are the two dominant conversions.
- [ ] The three SaaS products receive equal emphasis.
- [ ] Aegis appears as open source and “Coming soon.”
- [ ] The founder mention remains secondary to the products.
- [ ] The page supports Portuguese and English in full.
- [ ] All sensitive claims have been substantiated and reviewed.

### Visual originality

- [ ] The eclipse thread organizes the narrative and is not merely decorative.
- [ ] Product media is real.
- [ ] There are no repetitive generic cards, AI neon, or invented mockups.
- [ ] Navy, ivory, copper, Poppins, and JetBrains Mono follow the Voynan brand.
- [ ] The page draws on the reference's cinematic principles without copying its assets or distinctive composition.

### Interaction

- [ ] Navigation, language controls, CTAs, and form work with a keyboard.
- [ ] Language can change without losing the current chapter.
- [ ] The form preserves data when submission fails.
- [ ] Copying the email provides visual and accessible confirmation.
- [ ] No animation blocks or captures scrolling.

### Responsiveness and resilience

- [ ] Desktop, tablet, and mobile have been validated with real content.
- [ ] Products leave the sticky stage on mobile.
- [ ] Every video has a poster and fallback.
- [ ] Reduced motion preserves full comprehension.
- [ ] Media, JavaScript, and form failures each have defined behavior.
- [ ] No provisional link or invented metric reaches production.

---

## 16. Final direction

Voynan's first landing page will be a **product-led, cinematic, and editorial** experience. Real products establish competence; results and testimonials turn competence into trust; services convert that trust into new projects; open source demonstrates openness; the founder adds humanity; and contact closes the narrative with minimal friction.

The eclipse is the experience's signature: it starts as a brand mark, transforms into a system, and ends as an invitation.
