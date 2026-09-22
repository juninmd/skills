# Anti-Slop Frontend Taste

## Preflight
```bash
git diff --stat HEAD~1 2>/dev/null || true
rg -n "bg-gradient-to|backdrop-blur|rounded-2xl" src/ | head -20
```

Read the room before touching code. Defaulting to generic AI aesthetics (purple hero gradients, dark mesh cards, Inter font, 3 equal cards) signals zero intentional design.

## Brief Inference (Read the Room)

Extract signals from the brief before generating JSX or CSS:
1. **Page kind**: landing (SaaS, consumer, agency, event), portfolio, redesign, or high-density product UI.
2. **Vibe cues**: "minimalist", "brutalist", "calm", "editorial", "Linear-style", "tactile", "raw tech", "serious B2B".
3. **Reference signals**: named products, pasted URLs, competitor styles.
4. **Audience**: technical B2B buyer vs design-conscious consumer vs hiring manager. The audience picks the aesthetic.
5. **Brand assets**: existing logos, primary hues, established typography.
6. **Quiet constraints**: accessibility-first, public sector, trust-critical commerce. These override aesthetic preferences.

Declare a single-line **Design Read** before generating markup:
> *"Reading this as: `<page kind>` for `<audience>`, with a `<vibe>` language, leaning toward `<aesthetic family>`."*

### Anti-Default Discipline
Never default to:
- Indigo/purple radial gradients behind centered hero text.
- Three identical rounded cards with centered icons.
- Generic glassmorphism on every surface (`backdrop-blur` without purpose).
- Inter font everywhere without deliberate pairing.
- Equal padding and symmetrical margins on every section.

## The Three Dials

Calibrate these three axes based on the Design Read:
- **`DESIGN_VARIANCE` (1–10)**: 1 = strict symmetrical grid; 10 = dynamic asymmetry, broken grids, unexpected layouts.
- **`MOTION_INTENSITY` (1–10)**: 1 = static/instant; 10 = cinematic choreography, physics springs, scroll-linked transforms.
- **`VISUAL_DENSITY` (1–10)**: 1 = airy art gallery, generous negative space; 10 = dense cockpit, high data density.

| Archetype | Variance | Motion | Density | Typical Stack / Tokens |
|---|---|---|---|---|
| Minimalist / Editorial | 5–6 | 3–4 | 2–3 | Swiss typography, large serifs or grotesque sans, wide margins |
| Premium Consumer / Brand | 7–8 | 5–7 | 3–4 | High-fidelity product renders, subtle depth, warm neutrals |
| Brutalist / Raw Tech | 8–10 | 4–6 | 5–7 | Stark borders (1px solid), monospace accents, neon or monochrome |
| B2B SaaS / Developer Tool | 5–7 | 4–5 | 6–8 | Structured tables, compact toolbars, crisp borders, Geist/Inter |
| Trust-First / Regulated | 3–4 | 2–3 | 4–5 | Predictable navigation, high contrast, zero decorative motion |

## Aesthetic Archetypes

### 1. Minimalist / Editorial
- **Typography**: Dominant display scale (ratio 1.25+), generous line height on body, selective italic or editorial serif for quotes.
- **Color**: Monochromatic or dual-tone with a single deliberate accent. Negative space acts as structural separation instead of borders.
- **Layout**: Asymmetric text placement, large whitespace gutters, understated text-only navigation.

### 2. Brutalist / Raw Tech
- **Typography**: Monospace metadata labels (`font-mono text-xs uppercase tracking-widest`), bold geometric grotesque headers.
- **Color & Borders**: Hard 1px high-contrast borders (`border-neutral-900 dark:border-neutral-100`), zero box-shadow blurs (use solid drop shadows: `box-shadow: 4px 4px 0px #000`).
- **Surfaces**: Flat surfaces, terminal-style badges, exposed grid lines, raw tags.

### 3. Soft / Tactile
- **Surfaces**: Tactile minimalism, subtle inner highlights (`inset 0 1px 0 rgb(255 255 255 / 0.15)`), layered elevation.
- **Color**: Warm off-whites (`oklch(98% 0.01 60)`), slate neutrals rather than dead black, subtle pastel washes.
- **Interactions**: Tactile button active states (`active:scale-[0.98] transition-transform duration-100`), gentle springs.

## Audit-First Redesign Workflow

When improving existing user interfaces:
1. **Inventory**: Map existing semantic elements, forms, and handlers before altering styles. Never break working interactions.
2. **Audit Slop**: Flag generic defaults — bloated cards, lack of visual hierarchy, inconsistent padding, blurry shadows.
3. **Calibrate**: State the Design Read and Three Dials for the target improvement.
4. **Surgical Restyle**: Replace decorative fluff with structural typography, calibrated spacing rhythm, and clear elevation hierarchy.
5. **Verify**: Check responsive behavior, keyboard focus visibility, and WCAG contrast (4.5:1 body, 3:1 UI boundaries).

## Stop
- Emitting UI code without declaring the single-line Design Read.
- Falling back to generic AI purple gradients or 3 equal feature cards.
- Sacrificing text legibility or WCAG contrast for aesthetic fluff.

## Rules
- Match the dial values to the user and audience, not generic preferences.
- When redesigning, preserve existing state logic, accessibility aria labels, and form contracts.
- Pair typefaces with purpose: if using a display font for headers, keep body text in a clean, legible workhorse sans.
- Keep motion durations under 300ms for interaction feedback; reserved-motion queries must be respected.

## Checklist
- [ ] Single-line Design Read declared before code generation.
- [ ] Three Dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) calibrated.
- [ ] Anti-default check passed: no unearned purple hero gradient or generic card trio.
- [ ] Contrast meets WCAG standards (4.5:1 text, 3:1 controls).
- [ ] Semantic structure, keyboard focus, and responsive breakpoints verified.
