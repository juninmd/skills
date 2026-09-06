
# Code Snippet Images

## Preflight
```bash
wc -l snippet.ts                       # over ~30 lines is unreadable as an image
rg -nEi 'token|secret|api[_-]?key|@internal\.' snippet.ts   # nothing private in the URL
```

Decide first whether the code here is decoration or content. If the reader must copy it, a fenced block is the deliverable and the image is at most an extra.

## Decide Whether to Do This At All
An image of code cannot be copied, searched, indexed, diffed, or read by a screen reader.

| Use an image | Use a fenced block |
|---|---|
| README hero, above the real block | anything the reader must copy |
| Slide deck, conference talk | documentation, tutorials |
| Social share, blog header | a pull-request diff |
| Anywhere the code is **decoration** | anywhere the code is **content** |

Wherever the reader needs the text, keep the fenced block and put the image beside it — never instead of it.

## Workflow
1. Trim to the smallest self-contained fragment, ideally under 30 lines.
2. Build the URL from the service base (`https://carbon.now.sh/`) with the parameters below.
3. Percent-encode the snippet into `code` — **last, and completely**.
4. Open the URL in a headless browser and wait for highlighting to settle.
5. Screenshot the **export element only** (`#export-container` on carbon), never the viewport.
6. Inspect the image, then store its full URL beside the asset so it is reproducible.

## Parameters

| Group | Params |
|---|---|
| Content | `code` (encoded), `l` language — `auto` only when the dialect is genuinely ambiguous |
| Theme | `t` theme, `bg` background |
| Type | `fm` font family, `fs` size, `lh` line height |
| Frame | `ph`/`pv` padding, `ds` drop shadow, `wc`/`wa` window chrome, `ln` line numbers |

```bash
CODE=$(jq -sRr @uri < snippet.ts)      # encode last, and fully
URL="https://carbon.now.sh/?l=typescript&t=night-owl&fs=14px&ln=false&code=$CODE"
npx playwright screenshot --wait-for-selector='#export-container' "$URL" out.png
```

Raw newlines and an unencoded `&`, `+`, `#`, or `%` truncate the snippet **silently** — the image renders, just missing half the code. Always decode `code` back and compare it byte for byte against the source.

## Reproducibility
Store the full URL beside the asset — a sibling `.url` file, or a comment in the document. Six months later the image needs a one-line edit, and without the URL that means rebuilding every parameter by eye.

## When the Service Fails
It can be down, rename its export element, or reject a long URL — query strings hit length limits before anything else does.

1. Shrink the snippet. It was probably too long to read as an image anyway.
2. Render locally: highlight the code into styled HTML (Shiki, Prism) and screenshot that node.
3. Ship the fenced block. It was always the more useful artifact.

## Stop
- The snippet contains a secret, a token, an internal hostname, or customer data. Do not build the URL at all.
- Decoding `code` does not reproduce the source byte for byte. The image is silently truncated — fix the encoding.
- The reader needs to copy this code. Ship the fenced block; an image is not a substitute.

## Rules
- Never put secrets, tokens, internal hostnames, or customer data in the URL. Query strings land in shell history, proxy logs, and browser history — all three.
- Default to a dark theme and a monospace ligature font; both survive light and dark reading contexts.
- Symmetric padding with the shadow on for standalone shares; drop shadow and chrome when the image sits inside another frame.
- Line numbers only when the surrounding text cites specific lines.
- Keep theme, font, and padding identical across a document set. Mismatched snippet images look like they were pasted from three different articles, because they were.
- Screenshots of a running UI belong to `screenshot-capture`; the prose around the image to `documentation`.

## Checklist
- [ ] The code is decoration here, not content — a fenced block exists wherever it must be copied.
- [ ] `code` round-trips: decoding it yields the original snippet byte for byte.
- [ ] Theme, font, and padding identical across the document set.
- [ ] Screenshot targets the export container, with no page background bleed.
- [ ] Text legible at the final display width.
- [ ] Full URL stored beside the asset for reproducibility.
- [ ] No credentials or private identifiers in the image or the URL.
