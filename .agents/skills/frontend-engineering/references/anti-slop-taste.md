# Anti-Slop Frontend Taste

## Contents
- Preflight
- Brief Inference (Read the Room)
- Design Plan, Then Check It Against the Brief
- Default Clusters to Exclude
- The Three Dials
- Aesthetic Archetypes
- Audit-First Redesign Workflow
- Stop, Rules, Checklist

## Preflight
```bash
git diff --stat HEAD~1 2>/dev/null || true
rg -n -i '#F4F1EA|#FAF7F2|#D97757|#0B0B0B|tracking-widest|bg-gradient-to|backdrop-blur|rounded-2xl|shadow-md' src/ | head -20
rg -n ' · |→' src/ --glob '*.{tsx,jsx,html,vue,svelte}' | head -10   # template chrome in copy
```

Read the room before touching code. Output that lands in one of the clusters below without the brief asking for it signals that no design decision was made.

## Brief Inference (Read the Room)

Extract signals from the brief before generating JSX or CSS:
1. **Page kind**: landing (SaaS, consumer, agency, event), portfolio, redesign, or high-density product UI.
2. **Subject**: the product's industry, materials, and vernacular. Distinctive choices come from the subject, not from a style label. If the brief does not name one, propose a concrete subject, audience, and primary job, and confirm it.
3. **Vibe cues**: "minimalist", "brutalist", "calm", "editorial", "Linear-style", "tactile", "raw tech", "serious B2B".
4. **Reference signals**: named products, pasted URLs, competitor styles.
5. **Audience**: technical B2B buyer vs design-conscious consumer vs hiring manager. The audience picks the aesthetic.
6. **Brand assets**: existing logos, primary hues, established typography. These outrank every default below.
7. **Quiet constraints**: accessibility-first, public sector, trust-critical commerce. These override aesthetic preferences.

Declare a single-line **Design Read** before generating markup:
> *"Reading this as: `<page kind>` for `<audience>`, with a `<vibe>` language, leaning toward `<aesthetic family>`."*

## Design Plan, Then Check It Against the Brief

Write the plan before the code, in a few lines:
1. **Color**: 4–6 named hex values with roles (surface, ink, muted, accent, state).
2. **Type**: one or two families and their roles; if two, make them clearly distinct. Body line length under ~80 characters.
3. **Layout**: one sentence per section, optionally an ASCII wireframe, and the alignment spine (left, centered, or justified, and why).
4. **The one bold move**: the single memorable element. Everything around it stays quiet.
5. **Principles**: two or three sentences on what makes this page specific to this subject.

Then review the plan against the brief before building. For each line ask: would I write this same line for any similar prompt? If yes, it is a default, not a choice. Revise it, and say what changed and why. Check every line against the clusters below. Build only from the revised plan.

## Default Clusters to Exclude

A style label ("clean", "modern") steers less than a list of what to avoid. Generated UI currently clusters around these looks. Each is legitimate when the brief asks for it — the brief's own words always win — but none may appear because it was the first thing that came to mind.

| Cluster | Concrete signature | Instead |
|---|---|---|
| Cream and terracotta | warm off-white page (`#F4F1EA`, `#FAF7F2`), high-contrast serif display, clay accent (`#D97757`, `#C2410C`) | a surface and accent drawn from the subject's own materials or brand hue |
| Acid on black | near-black ground (`#0A0A0A`, `#111111`) with one neon accent (acid green `#C6FF00`, vermilion `#FF4D2E`) | a palette with real mid-tones; reserve saturation for state and the primary action |
| Broadsheet pastiche | hairline 1px rules, zero radius, dense newspaper columns, masthead serif, dateline metadata | editorial structure only when the content is editorial; otherwise a grid sized to the content |
| SaaS card kit | content chopped into identical cards, one radius on everything (`16px`), the same soft shadow (`0 1px 3px rgb(0 0 0 / .1)`) under each, three-up feature grid, icons in pastel circles, gradient washes | radius and elevation that vary **by role**; let typography and spacing carry structure |
| Template chrome | tracked ALL-CAPS eyebrow above every heading, `01 / 02 / 03` markers on content that is not a sequence, meta joined as `A · B · C`, `WORD — fragment` labels, tinted near-black (`#0B0B0B`) for ink, monospace for small labels, `→` appended to every link and button | structural devices only where they encode information: numbering for real sequences, labels where the content needs a label |
| Headline tricks | one italic, bold, or colored accent word inside the headline; pill badge above a centered hero; big number + small label + gradient accent as the default hero | a hero that opens with the most characteristic thing in the subject's world |
| Older but persistent | indigo-to-purple hero gradient (`#6366F1` → `#A855F7`), glassmorphism on every surface, one ubiquitous default sans, everything centered, equal padding on every section | one committed hue earned by the brand; one surface treatment used with intent; a deliberate pairing; a real alignment spine |

Motion has its own default: fade-and-slide-up on every section and hover lift on every card. One orchestrated moment lands better than scattered effects; motion that answers a user action is welcome when it shows what changed.

## The Three Dials

Calibrate these three axes based on the Design Read:
- **`DESIGN_VARIANCE` (1–10)**: 1 = strict symmetrical grid; 10 = dynamic asymmetry, broken grids, unexpected layouts.
- **`MOTION_INTENSITY` (1–10)**: 1 = static/instant; 10 = cinematic choreography, physics springs, scroll-linked transforms.
- **`VISUAL_DENSITY` (1–10)**: 1 = airy art gallery, generous negative space; 10 = dense cockpit, high data density.

| Archetype | Variance | Motion | Density | Typical Stack / Tokens |
|---|---|---|---|---|
| Minimalist / Editorial | 5–6 | 3–4 | 2–3 | Swiss typography, large serif or grotesque display, wide margins |
| Premium Consumer / Brand | 7–8 | 5–7 | 3–4 | High-fidelity product renders, subtle depth, neutrals tinted by the product's materials |
| Brutalist / Raw Tech | 8–10 | 4–6 | 5–7 | Stark 1px borders, monospace for real data, monochrome plus one state color |
| B2B SaaS / Developer Tool | 5–7 | 4–5 | 6–8 | Structured tables, compact toolbars, crisp borders, a workhorse sans with tabular figures, named in the plan |
| Trust-First / Regulated | 3–4 | 2–3 | 4–5 | Predictable navigation, high contrast, zero decorative motion |

The archetypes never override the exclusions: where a row seems to need an excluded item, the design plan names it and gives the reason.

## Aesthetic Archetypes

### 1. Minimalist / Editorial
- **Typography**: Dominant display scale (ratio 1.25+), generous body line height, an editorial serif for pull quotes rather than accent words in headings.
- **Color**: Monochromatic or dual-tone with a single deliberate accent. Negative space acts as structural separation instead of borders.
- **Layout**: Asymmetric text placement, large whitespace gutters, understated text-only navigation. Not a newspaper costume — no mastheads or datelines unless the content is news.

### 2. Brutalist / Raw Tech
- **Typography**: Bold geometric grotesque headers. Monospace only for content that is data — IDs, timestamps, code, measurements — in its natural case, never as tracked-out uppercase eyebrows.
- **Color & Borders**: Hard 1px high-contrast borders (`border-neutral-900 dark:border-neutral-100`), solid offset shadows instead of blur (`box-shadow: 4px 4px 0 #000`). True black or a neutral ramp, not one neon accent on near-black.
- **Surfaces**: Flat surfaces, exposed grid lines, raw tags.

### 3. Soft / Tactile
- **Surfaces**: Tactile minimalism, subtle inner highlights (`inset 0 1px 0 rgb(255 255 255 / 0.15)`), layered elevation.
- **Color**: Light neutrals tinted toward the brand hue (`oklch(97% 0.01 <brand-hue>)`), not default cream; slate neutrals rather than dead black; subtle washes.
- **Interactions**: Tactile button active states (`active:scale-[0.98] transition-transform duration-100`), gentle springs.

## Audit-First Redesign Workflow

When improving existing user interfaces:
1. **Inventory**: Map existing semantic elements, forms, and handlers before altering styles. Never break working interactions.
2. **Audit Slop**: Match the current UI against each cluster above; record which ones it carries and where.
3. **Calibrate**: State the Design Read, the Three Dials, and a design plan checked against the brief.
4. **Surgical Restyle**: Replace decorative fluff with structural typography, calibrated spacing rhythm, and clear elevation hierarchy. Spend boldness in one place, then remove one decoration before calling it done.
5. **Verify**: Check responsive behavior, keyboard focus visibility, and WCAG contrast (4.5:1 body, 3:1 UI boundaries). Take a screenshot and critique it against the plan.

## Stop
- Emitting UI code without the Design Read and a design plan checked against the brief.
- The output lands in a default cluster the brief did not ask for.
- Sacrificing text legibility or WCAG contrast for aesthetic fluff.

## Rules
- Match the dial values to the user and audience, not generic preferences.
- The brief's explicit direction beats every exclusion here, including when it asks for one of the clusters.
- When redesigning, preserve existing state logic, accessibility aria labels, and form contracts.
- Pair typefaces with purpose: a display face for headers keeps body text in a legible workhorse sans.
- Keep motion durations under 300ms for interaction feedback, and respect reduced-motion queries.

## Checklist
- [ ] Single-line Design Read declared before code generation.
- [ ] Design plan (4–6 hex colors, type roles, layout, one bold move) written and revised against the brief.
- [ ] Three Dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) calibrated.
- [ ] No default cluster present unless the brief asked for it.
- [ ] Contrast meets WCAG standards (4.5:1 text, 3:1 controls).
- [ ] Semantic structure, keyboard focus, and responsive breakpoints verified.

Adapted in part from anthropics/skills/frontend-design (Apache-2.0, © Anthropic).
