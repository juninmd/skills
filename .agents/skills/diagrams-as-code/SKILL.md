---
name: diagrams-as-code
description: |
  Keep diagrams as versioned Mermaid source with a rendered image beside them, for hosts that do not render fenced diagram blocks. Use for .mmd files, the mermaid CLI, moving diagram blocks out of Markdown, updating one in place, and batch rendering.
---

# Diagrams As Code

## Preflight
```bash
rg -l '```mermaid' --glob '*.md' | head        # what would be converted
ls docs/diagrams/ 2>/dev/null
npx -p @mermaid-js/mermaid-cli mmdc --version   # is the renderer even available?
```

Confirm the target host does not render fenced `mermaid` before converting anything. Converting a block the host already renders trades a live diagram for one that goes stale.

## Check the Host First
Converting a diagram a host already renders is pure loss — you trade a live block for an image that can go stale.

| Host | Renders fenced `mermaid`? |
|---|---|
| GitHub, GitLab (Markdown, issues, PRs) | yes — keep the block, stop here |
| VitePress, Docusaurus, MkDocs (with the plugin) | yes |
| npmjs.com package page | **no** |
| Confluence, Notion export, most wikis | **no** |
| PDF and slide exports | **no** |
| Editor previews without the extension | **no** |

Convert only for the "no" rows.

## Workflow
1. Confirm the host does not render it.
2. Create `docs/diagrams/` if missing. Source and image always live side by side.
3. Name each diagram in kebab-case, derived from the nearest preceding heading.
4. Write the block body — fences stripped — to `docs/diagrams/NAME.mmd`. That file is now the source of truth.
5. Render it.
6. Replace the fenced block with an image reference plus a link back to the `.mmd`.
7. To update: edit the `.mmd`, keep the **exact** filename, re-render in place.
8. Add the CI drift check — without it, "no stale images" is a wish.

## Rendering

```bash
npx -p @mermaid-js/mermaid-cli mmdc \
  -i docs/diagrams/auth-flow.mmd \
  -o docs/diagrams/auth-flow.svg \
  -p puppeteer.json
```

```json
{ "args": ["--no-sandbox", "--disable-dev-shm-usage"] }
```

`mmdc` drives a headless browser and dies in CI sandboxes and slim containers without that config. `--no-sandbox` is what makes it survive a CI container; `--disable-dev-shm-usage` is what stops it crashing on Docker's default 64MB `/dev/shm`.

## The Markdown After Conversion
Two lines replace the fenced block:

| Line | Shape |
|---|---|
| Image | an image reference to `docs/diagrams/auth-flow.svg`, whose **alt text describes what the diagram shows** — "Authentication flow: browser, gateway, identity provider, session store", never "architecture diagram" |
| Caption | an italic `Source:` line linking to `docs/diagrams/auth-flow.mmd`, so the next reader edits the source and not the image |

Never leave both a fenced block and an image for the same diagram — they diverge, and the reader cannot tell which is current.

## CI Drift Check

```bash
find docs/diagrams -name '*.mmd' -exec sh -c \
  'npx -p @mermaid-js/mermaid-cli mmdc -i "$1" -o "${1%.mmd}.svg" -p puppeteer.json' _ {} \;
git diff --exit-code docs/diagrams/    # non-zero means an image is stale
```

## Diagram Type

| Showing | Type |
|---|---|
| Steps, branches, decisions | `flowchart` |
| Who calls whom, in what order | `sequenceDiagram` |
| Data shape and relationships | `erDiagram` |
| Lifecycle and transitions | `stateDiagram-v2` |
| Types and their relations | `classDiagram` |

A flowchart used for a call sequence hides the ordering that was the whole point of drawing it.

## Stop
- The host renders fenced `mermaid` natively. Stop — keep the block; there is nothing to do.
- `mmdc` cannot run in this environment. Do not commit a hand-edited image; fix the renderer or leave the block.
- The update would change the filename. Stop — it orphans every existing reference silently.

## Rules
- The `.mmd` is the source; the rendered image is derived output, **never** hand-edited.
- SVG is the default — it diffs as text and scales. Fall back to PNG only where the host blocks inline SVG, and mark `docs/diagrams/*.png binary` in `.gitattributes`.
- Never rename on update. A new filename orphans every existing reference, silently.
- Commit source and image together, never in separate commits.
- Filenames are lowercase kebab-case and match the heading they document.
- What the diagram must show belongs to `software-architecture`; where it lives in the docs to `documentation`.

## Checklist
- [ ] Host support checked before converting anything.
- [ ] Every diagram has a `.mmd` source and a rendered image beside it.
- [ ] Images carry descriptive alt text and a link back to the source.
- [ ] Never both a fenced block and an image for the same diagram.
- [ ] Updates kept the filename; source and image committed together.
- [ ] The CI drift check exists and passes.
