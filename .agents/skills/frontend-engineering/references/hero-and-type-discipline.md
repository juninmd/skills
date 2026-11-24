# Hero Composition and Type Discipline

## Contents
- Preflight
- Opening Screen by Format
- Hero Directions
- Type Discipline
- Controls and Copy
- Rendered Critique
- Stop, Rules, Checklist

## Preflight
```bash
rg -n -i 'eyebrow|kicker|transition: ?all|transition-all|font-family' src/ | head -20
rg -c '—|<br><em>' src/ --glob '*.{tsx,jsx,html,vue,svelte}' | head   # em-dashes and italic headline splits
```

Complements [anti-slop-taste](anti-slop-taste.md) (clusters, dials) and [frontend-design](frontend-design.md) (numeric system). Open it when composing a first screen or auditing type and chrome.

## Opening Screen by Format

| Format | Opens with |
|---|---|
| News, blog, docs, dashboard, search index, utility tool, resume | live content, workspace, or masthead plus story grid; never push real content below a `100vh` banner |
| Brand, product, store, event, portfolio, long story | a hero, but not the 50/50 split (H1, paragraph, button, link, rule, stat columns beside a media box) |

## Hero Directions
Adapt or invent; never assign by business type.
- **Monumental headline over a wide stage**: centered display `<h1>` at 70-92% width, one or two lines of support, one action, a tactile preview below.
- **Full-bleed takeover**: edge-to-edge photo or canvas from `y = 0` behind a header without a border; type in a clear, high-contrast zone.
- **Layered depth**: oversized lettering behind a cutout subject, title and action on the lower horizon.
- **Poster color-block**: stacked display type over bold chromatic blocks or gradients bleeding off the edges.

Rules for any hero: `clamp(3.5rem, 7.5vw, 8rem)` display size with 0.9-1.0 line height; at most 25 words of support and one primary action; no bottom KPI strip; headline visible at rest (never stuck at `opacity: 0`) and honoring `prefers-reduced-motion`. Give the fixed header a surface once scrolled. Carry the same ambition below the fold; do not collapse into three-column card rows after screen one.

## Type Discipline
- At most 2 font families. Use `font-variant-numeric: tabular-nums` instead of a third mono face, unless the product is code or terminal tooling.
- At most 3 body sizes (for example heading, body, small). Separate subheads, buttons, and labels with weight, family, and color. Allow a 4th step only for a requested dense table or dashboard. Hero `<h1>` and the brand name are exempt.
- One scale for all body paragraphs and lists: no oversized `.lead` paragraph over smaller siblings.
- Sentence case for labels and table headers; body lines at or under 65ch; display tracking `-0.02em` to `-0.05em`; no text under 13px above the fold.
- Pick typefaces from the subject's character. A display serif plus generic sans is a default, not a decision.

## Controls and Copy
- One primary CTA per section. Mode, size, and filter choices use a segmented toggle, tabs, radios, `<select>`, or direct canvas interaction, not a cluster of bordered buttons.
- Group with whitespace, 1px dividers, or surface tint; no card inside a card.
- Reserve bordered or capsule shapes for interactive controls and real status cells.
- Heading leads with the benefit (`Lightweight shell`), not the spec (`2.6 kg cabin mass`). Cut `seamless`, `elevate`, `reimagined`, and comments about the design itself.
- No `<br><em>` headline splits; no em-dashes or spaced en-dashes in generated copy. Keep user-supplied text verbatim.
- Name transition properties explicitly; keep 140-240ms with ease-out.

## Rendered Critique
Serve the page over HTTP so fonts and assets load. Capture desktop (opening viewport and scrolled sections) and `390x844` mobile. Check single-line nav, clean scrolled header, no text collisions, no horizontal overflow or clipped display words, and the same craft down to the footer. Fix in one pass.

```bash
npx playwright screenshot --viewport-size=390,844 --full-page http://localhost:5173 mobile.png
```

## Stop
- A content or workspace page opens behind a marketing banner. Move the content up.
- Body text uses a fourth size or third family without a dense-data brief.

## Rules
- Existing design tokens and framework conventions win over every default here.
- An explicit style request from the user (brutalist, minimalist, editorial) overrides these defaults.

## Checklist
- [ ] Opening screen matches the format; hero, if any, is not a 50/50 split and has no KPI strip.
- [ ] At most 2 families and 3 body sizes; labels in sentence case.
- [ ] One primary CTA per section; no nested cards; no decorative chips or numbering.
- [ ] No em-dashes in generated copy; no `transition: all`; reduced motion honored.
- [ ] Desktop and 390x844 screenshots inspected.

Adapted from the `gemini-frontend-design` skill in the Google Gemini demo lab repository (Apache-2.0, Google Gemini authors).
