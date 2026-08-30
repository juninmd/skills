---
name: ascii-figures
description: |
  Decide whether a write-up needs a figure, then draw it as a plain-text block that survives a README, a pull request comment, or a terminal. Use for sketching a flow, a timeline, a before-and-after, or a hierarchy where no renderer is guaranteed.
---

# ASCII Figures

## Preflight
```bash
rg -c '```mermaid' README.md docs/*.md 2>/dev/null   # does this repo already rely on a renderer?
printf 'x%.0s' $(seq 72); echo                       # the width every line must fit inside
```

Settle where the text lands before choosing a form. The same block that renders as a diagram on one host ships as raw source on another, and a figure nobody can read is worse than the sentence it replaced.

## Pick the Form

| Where it lands | Renders a diagram block? | Use |
|---|---|---|
| GitHub Markdown, issues, pull requests | yes | A rendered diagram — `diagrams-as-code` owns it |
| npm package page, most wikis, plain email | no | Fenced ASCII |
| Terminal output, `--help`, CLI docs | no | Fenced ASCII |
| Code comment, commit message | no | Fenced ASCII, narrow |
| Slides and PDF export | no | An image, not text |

## Match the Figure to the Point

| The point is | Draw | Not |
|---|---|---|
| Order over time | A left-to-right chain | A box-and-arrow cloud |
| A branch or a decision | A fork with labeled edges | Prose with "if" |
| Before versus after | Two stacked columns | Two paragraphs |
| Parts of a whole | An indented tree | A bulleted list of nouns |
| Quantities or a matrix | A **table** | Any drawing |
| One sentence's worth | Nothing — write the sentence | A figure for decoration |

## Workflow
1. Name the single claim the figure must prove. Two claims mean two figures, or one paragraph.
2. If the claim fits in one sentence, write the sentence. Most do.
3. Pick the form from the table above; reach for a table before any drawing when the content is values.
4. Draw inside a fenced block, ASCII only, every line under 72 columns, no tabs, no trailing spaces.
5. Label in lowercase; put the title in `[ BRACKETS ]` above the drawing.
6. Put the claim in prose **above** the figure and the consequence below it. The figure is evidence, never the argument.
7. Cap it at one figure per point and two per section; re-read the section without them to confirm each still earns its space.

```text
[ REQUEST PATH ]

 client ──▶ edge cache ──▶ api ──▶ db
              │             │
              ▼             ▼
            hit: 40ms    miss: 320ms
```

## Stop
- The drawing needs more than 72 columns or three levels of nesting. It is a real diagram now — hand it to `diagrams-as-code`.
- Alignment only holds in your editor. Check it at 72 columns in a monospace block or drop it.
- The figure needs a legend to be read. A figure that needs explaining has failed at the one thing it does better than prose.
- Content is numbers. Use a table; a bar chart made of hyphens is a table with a reading tax.

## Rules
- Copy a shape you have seen render, do not invent notation. New symbols cost the reader a decode pass they did not agree to.
- Box-drawing and arrow characters are safe in UTF-8 contexts; drop to `-`, `|`, `+`, `->` wherever the encoding is unknown.
- Never paste framework-specific component markup into a plain Markdown file. It ships as literal source in a README, a comment, or an email.
- One accent idea per figure. A second visual dimension needs a second figure.
- Keep the figure next to the claim it proves. A figure two paragraphs from its sentence is decoration.
- Prose carries the argument; the figure only compresses it. Anything the reader must know cannot live in the drawing alone.
- Screenshots of real interfaces are a different tool — `screenshot-capture` owns those, and `documentation` owns where any of it belongs.

## Checklist
- [ ] Each figure proves one named claim, stated in prose directly above it.
- [ ] Form chosen from the content type; values are in tables, not drawings.
- [ ] Every line under 72 columns, ASCII-safe for the destination, no tabs.
- [ ] Lowercase labels, bracketed uppercase title.
- [ ] At most one figure per point, two per section.
- [ ] Section still reads correctly with every figure removed.
