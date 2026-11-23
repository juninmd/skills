# Modern Web Platform

Use when choosing between a library and native CSS/HTML, adopting a newer platform feature, or deciding which standard to target. Status below was checked in November 2026 against web.dev digests and the W3C pages cited; features marked **verify** had conflicting secondary sources, so confirm on [webstatus.dev](https://webstatus.dev/) or [MDN](https://developer.mozilla.org/) before shipping.

## Contents
- Standards to target
- Adoption policy (Baseline)
- CSS architecture
- UI primitives without JavaScript
- Motion and navigation
- Performance budgets
- Design tokens
- Stop

## Standards to target
| Standard | Status | Do |
|---|---|---|
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | W3C Recommendation; also ISO/IEC 40500:2025 | Audit and claim conformance against 2.2 AA. See [accessibility](accessibility.md). |
| [WCAG 3.0](https://www.w3.org/TR/wcag3/) | Working Draft (March 2026 draft seen); does not replace WCAG 2 | Do not cite it as a requirement. Follow it only to watch where scoring is heading. |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, judged at the 75th percentile of real users; INP replaced FID in March 2024 | Budget against these. Source: [web.dev/articles/vitals](https://web.dev/articles/vitals). Measurement belongs to `performance-engineering`. |
| [Design Tokens Format 2025.10](https://www.designtokens.org/) | Stable Community Group report, not on the W3C Standards Track | Use `$value`/`$type` JSON for cross-tool tokens; say "DTCG 2025.10", not "W3C standard". |
| Baseline | web-features data behind web.dev and MDN badges | Gate every newer feature with the policy below. |

## Adoption policy (Baseline)
| Baseline status | Rule |
|---|---|
| Widely available | Default. No fallback needed inside the repo's browserslist. |
| Newly available | Allowed when the feature degrades gracefully or sits behind `@supports`; name the fallback in the PR. |
| Limited availability | Progressive enhancement only: the page must be complete and usable without it. |

Rules that outrank the table: read the repo's `browserslist` and analytics before deciding; test the enhanced and fallback paths; never ship a feature whose absence breaks a primary task.

## CSS architecture
- **Cascade order with `@layer`**: declare `@layer reset, tokens, base, components, utilities;` once. Utilities win without `!important`, and third-party CSS goes in a lower layer.
- **Container queries** for components, media queries for page layout. `container-type: inline-size` on the wrapper, `@container (min-width: 30rem)` in the component, `cqi` units for fluid inner sizing. Size queries are widely available; style queries are narrower: **verify**.
- **`:has()`** replaces parent-state JavaScript (`.card:has(input:invalid)`). Keep selectors shallow; `:has()` on `body` with a broad subtree is a style-recalc cost.
- **Native nesting** instead of a preprocessor when the browserslist allows it.
- **`@scope`** for component-local selectors (newly available since December 2025, **verify**); keep `@layer` as the primary ordering tool.
- **Color**: `oklch()` for palette steps, `color-mix(in oklch, …)` for tints and states, `light-dark()` with `color-scheme: light dark` for themed tokens (needs no extra class toggle). Check contrast after mixing.
- **Viewport units**: `dvh`/`svh` for full-height mobile layouts, never bare `100vh`. See [mobile-web-polish](mobile-web-polish.md).
- **Type**: `text-wrap: balance` on headings, `text-wrap: pretty` on long prose (**verify** `pretty` support), `clamp()` for fluid sizes, `ch` for measure.
- **Media features**: honor `prefers-reduced-motion`, `prefers-contrast`, and `forced-colors` (Windows high contrast): in forced colors use system colors and keep borders, because backgrounds are dropped.

## UI primitives without JavaScript
| Need | Native option | Notes |
|---|---|---|
| Modal | `<dialog>` + `showModal()` | Focus trap, Esc, `::backdrop`, top layer built in. |
| Menu, tooltip, toast surface | `popover` attribute (`popovertarget`) | Light dismiss and top layer; newly available since 2024. Still manage focus and ARIA roles yourself. |
| Anchored floating UI | CSS anchor positioning (`anchor-name`, `position-anchor`, `position-area`) | Cross-browser support arrived 2025 to 2026: **verify**; keep a library fallback until the browserslist allows it. |
| Enter/exit animation | `@starting-style` + `transition-behavior: allow-discrete` | Animates `display` and top-layer entry without JS timing hacks. |
| Disable a subtree | `inert` | Replaces manual `aria-hidden` plus tab-index juggling for off-canvas content. |
| Auto-growing textarea | `field-sizing: content` | Limited availability: enhancement only. |
| Accordion | `<details name>` | Exclusive groups with no state code. |
Prefer these before adding a headless library; keep the library when it provides behavior the platform lacks (typeahead, complex roving focus).

## Motion and navigation
- **View Transitions**: same-document `document.startViewTransition()` is the baseline-newly path; cross-document (`@view-transition { navigation: auto; }`) suits multi-page sites, **verify** support. Name the shared element with `view-transition-name`, and wrap the call so browsers without it still update the DOM: `if (!document.startViewTransition) update(); else document.startViewTransition(update)`. Always include a `prefers-reduced-motion` branch.
- **Scroll-driven animations** (`animation-timeline: scroll()` or `view()`): limited availability, so wrap in `@supports (animation-timeline: scroll())` and keep the content readable without the effect.
- **Animating to `height: auto`**: `interpolate-size` / `calc-size()` is Chromium-only; use the grid-rows technique in `motion-design` (web-animation-recipes).
- **Prefetch/prerender**: Speculation Rules (`<script type="speculationrules">`) are Chromium-only enhancement; never put non-idempotent URLs in the list.

## Performance budgets
- **INP** is the interaction metric. Break long tasks (above 50 ms) with `scheduler.yield()` where present, falling back to `setTimeout`; move work off the input handler; use `content-visibility: auto` plus `contain-intrinsic-size` for long offscreen sections.
- **LCP**: preload only the LCP image, set `fetchpriority="high"` on it, never lazy-load it, serve AVIF or WebP with explicit `width`/`height`.
- **CLS**: reserve space (`aspect-ratio`, intrinsic sizes, font `size-adjust`), and animate only `transform`/`opacity`.
- Report field data (CrUX or RUM) before and after, not just a lab run.

## Design tokens
- One JSON source in DTCG 2025.10 shape (`$type`, `$value`, aliases like `{color.brand.500}`), compiled by the repo's token tool into CSS custom properties; do not hand-copy values into three formats.
- Name tokens by role (`color.surface.raised`), not by value (`color.gray.200`) at the semantic layer; layering is in [design-systems](design-systems.md).
- Themes are token sets resolved at build or via `light-dark()`, never forked components.

## Stop
- A feature is "limited availability" and the primary task depends on it. Move it to enhancement or pick the fallback.
- The PR says "WCAG 3" or "W3C standard" about a Working Draft or a Community Group report. Correct the claim.
- A numeric budget is quoted from memory. Pull it from the cited page or the repo's own config.
