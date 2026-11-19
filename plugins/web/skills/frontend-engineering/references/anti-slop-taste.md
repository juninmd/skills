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

Understand the context before editing. If the output falls into one of the clusters below and the brief never asked for it, nobody made a design decision.

## Brief Inference (Read the Room)

Pull these signals out of the brief before writing any JSX or CSS:
1. **Page kind**: landing (SaaS, consumer, agency, event), portfolio, redesign, or dense product UI.
2. **Subject**: the product's industry, materials, and jargon. Distinctive choices come from the subject, not from a style label. If the brief names none, propose a concrete subject, audience, and primary job, and get it confirmed.
3. **Vibe cues**: "minimalist", "brutalist", "calm", "editorial", "Linear-style", "tactile", "raw tech", "serious B2B".
4. **References**: named products, pasted URLs, competitor styles.
5. **Audience**: technical B2B buyer, design-conscious consumer, or hiring manager. The audience decides the aesthetic.
6. **Brand assets**: existing logos, primary hues, established type. These beat every default below.
7. **Hidden constraints**: accessibility-first, public sector, trust-critical commerce. These override taste.

State one **Design Read** line before producing markup:
> *"Reading this as: `<page kind>` for `<audience>`, with a `<vibe>` language, leaning toward `<aesthetic family>`."*

## Design Plan, Then Check It Against the Brief

Write a short plan before any code:
1. **Color**: 4-6 named hex values with roles (surface, ink, muted, accent, state).
2. **Type**: one or two families and what each is for; if two, make them clearly different. Keep body lines under about 80 characters.
3. **Layout**: one sentence per section, optionally an ASCII wireframe, plus the alignment spine (left, centered, or justified, and why).
4. **The one bold move**: a single memorable element, with everything around it kept quiet.
5. **Principles**: two or three sentences on what makes this page specific to this subject.

Then audit the plan against the brief. For each line ask: would I write this for any similar prompt? If so it is a default, not a choice; revise it and note what changed and why. Check every line against the clusters below, and build only from the revised plan.

## Default Clusters to Exclude

Telling a model to be "clean" or "modern" steers less than telling it what to avoid. Generated UI keeps collapsing into the looks below. Each is fine when the brief asks for it, and the brief's own words always win, but none may show up just because it came to mind first.

| Cluster | Concrete signature | Instead |
|---|---|---|
| Cream and terracotta | warm off-white page (`#F4F1EA`, `#FAF7F2`), high-contrast serif display, clay accent (`#D97757`, `#C2410C`) | surface and accent taken from the subject's own materials or brand hue |
| Acid on black | near-black ground (`#0A0A0A`, `#111111`) with one neon accent (acid green `#C6FF00`, vermilion `#FF4D2E`) | a palette with real mid-tones; keep saturation for state and the primary action |
| Broadsheet pastiche | 1px hairline rules, zero radius, dense newspaper columns, masthead serif, dateline metadata | editorial structure only for editorial content; otherwise a grid sized to the content |
| SaaS card kit | content cut into identical cards, one radius everywhere (`16px`), the same soft shadow (`0 1px 3px rgb(0 0 0 / .1)`) on each, three-up feature grid, icons in pastel circles, gradient washes | radius and elevation that vary **by role**; typography and spacing carry the structure |
| Template chrome | tracked ALL-CAPS eyebrow over every heading, `01 / 02 / 03` markers on non-sequences, meta strings like `A · B · C`, `WORD — fragment` labels, tinted near-black (`#0B0B0B`) ink, monospace for small labels, `→` on every link and button | structural devices only when they carry information: numbers for true sequences, labels where content needs one |
| Headline tricks | one italic, bold, or colored word inside the headline; pill badge above a centered hero; big number + small label + gradient accent as the default hero | open the hero with the most characteristic thing in the subject's world |
| Older but persistent | indigo-to-purple hero gradient (`#6366F1` to `#A855F7`), glassmorphism on every surface, the same default sans, everything centered, equal padding on every section | one committed hue the brand has earned; one surface treatment used on purpose; a deliberate type pairing; a real alignment spine |

Motion has a default too: fade-and-slide-up on every section and a lift on every card hover. One orchestrated moment beats scattered effects. Motion that responds to a user action is welcome when it shows what changed.

## The Three Dials

Set each axis from the Design Read:
- **`DESIGN_VARIANCE` (1-10)**: 1 = strict symmetrical grid; 10 = dynamic asymmetry, broken grids, surprising layouts.
- **`MOTION_INTENSITY` (1-10)**: 1 = static, instant; 10 = cinematic choreography, spring physics, scroll-linked transforms.
- **`VISUAL_DENSITY` (1-10)**: 1 = airy gallery with generous negative space; 10 = dense cockpit, heavy data.

| Archetype | Variance | Motion | Density | Typical stack / tokens |
|---|---|---|---|---|
| Minimalist / Editorial | 5-6 | 3-4 | 2-3 | Swiss typography, large serif or grotesque display, wide margins |
| Premium Consumer / Brand | 7-8 | 5-7 | 3-4 | High-fidelity product renders, subtle depth, neutrals tinted by the product's materials |
| Brutalist / Raw Tech | 8-10 | 4-6 | 5-7 | Stark 1px borders, monospace for real data, monochrome plus one state color |
| B2B SaaS / Developer Tool | 5-7 | 4-5 | 6-8 | Structured tables, compact toolbars, crisp borders, a workhorse sans with tabular figures, named in the plan |
| Trust-First / Regulated | 3-4 | 2-3 | 4-5 | Predictable navigation, high contrast, no decorative motion |

Archetypes never override the exclusions. If a row seems to need an excluded item, the plan must name it and give the reason.

## Aesthetic Archetypes

### 1. Minimalist / Editorial
- **Typography**: large display scale (ratio 1.25+), roomy body line height, an editorial serif for pull quotes instead of accent words in headings.
- **Color**: monochrome or two tones with one deliberate accent. Negative space separates content, not borders.
- **Layout**: asymmetric text placement, wide whitespace gutters, quiet text-only navigation. Not a newspaper costume: no mastheads or datelines unless the content is news.

### 2. Brutalist / Raw Tech
- **Typography**: bold geometric grotesque headers. Monospace only for genuine data (IDs, timestamps, code, measurements), in natural case, never as tracked-out uppercase eyebrows.
- **Color and borders**: hard 1px high-contrast borders (`border-neutral-900 dark:border-neutral-100`), solid offset shadows rather than blur (`box-shadow: 4px 4px 0 #000`). True black or a neutral ramp, not one neon accent on near-black.
- **Surfaces**: flat, with exposed grid lines and raw tags.

### 3. Soft / Tactile
- **Surfaces**: tactile minimalism, faint inner highlights (`inset 0 1px 0 rgb(255 255 255 / 0.15)`), layered elevation.
- **Color**: light neutrals tinted toward the brand hue (`oklch(97% 0.01 <brand-hue>)`), not default cream; slate neutrals instead of dead black; subtle washes.
- **Interactions**: tactile pressed states on buttons (`active:scale-[0.98] transition-transform duration-100`), gentle springs.

## Audit-First Redesign Workflow

For existing interfaces:
1. **Inventory**: map semantic elements, forms, and handlers before touching styles. Never break working interactions.
2. **Audit for slop**: compare the current UI to each cluster above and record which it carries and where.
3. **Calibrate**: state the Design Read, the Three Dials, and a plan checked against the brief.
4. **Restyle surgically**: replace decoration with structural typography, deliberate spacing rhythm, and a clear elevation hierarchy. Spend boldness in one place, then remove one decoration before calling it done.
5. **Verify**: check responsive behavior, visible keyboard focus, and WCAG contrast (4.5:1 body, 3:1 UI boundaries). Screenshot the result and critique it against the plan.

## Stop
- Writing UI code with no Design Read and no plan checked against the brief.
- The output lands in a default cluster the brief did not request.
- Trading text legibility or WCAG contrast for decoration.

## Rules
- Set the dials for this user and audience, not for generic taste.
- Explicit direction in the brief beats every exclusion here, even when it asks for one of the clusters.
- In a redesign, keep existing state logic, aria labels, and form contracts.
- Pair typefaces on purpose: a display face for headings, a legible workhorse sans for body.
- Keep interaction-feedback motion under 300ms and honor reduced-motion queries.

## Checklist
- [ ] One-line Design Read stated before any code.
- [ ] Plan (4-6 hex colors, type roles, layout, one bold move) written and revised against the brief.
- [ ] Three Dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) set.
- [ ] No default cluster present unless the brief asked for it.
- [ ] Contrast meets WCAG (4.5:1 text, 3:1 controls).
- [ ] Semantic structure, keyboard focus, and responsive breakpoints verified.
