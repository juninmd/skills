# Scene patterns and engine API

Open before choosing scenes or writing one. Patterns live in `templates/patterns/`; `scaffold.mjs --with a,b` copies them into `src/scenes/` and registers them between `hook` and `outro`.

## Engine in one screen

- A scene is `{ id, dur, transition: 'cut' | 'wipe' | 'glitch', build(root) -> update(t, dur) }`. `build` creates DOM once; `update(t)` sets every visual from the local time `t` (seconds) and nothing else.
- The timeline starts scene `i` at the previous end minus `TR` (0.5 s; 0 for the first scene or a `cut`). It publishes `window.__meta = { fps, duration, cuts, transition }`; `npm run meta` writes it to `out/meta.json`.
- Helpers: `scenes/parts.js` (`words`, `revealWords`, `typeInto`, `fade`, `rise`), `engine/ease.js` (`ease.*`, `prog`, `lerp`, `track`, `rand`), `scenes/frame.js` (`featureFrame({ n, version, title: [..], desc })` returns `{ area, tick }`; call `tick(t)` first in `update`), `scenes/terminal.js` (`terminal`, `barRow`).
- Determinism: no `requestAnimationFrame`, CSS animation or transition, `Date` or `Math.random`. Use `rand(seed)` with the frame index for jitter.

## Patterns

| file | use it for | replace |
|---|---|---|
| `counter-bar` | a number that matters (limit, price, speed): counter plus segmented bar | `TARGET`, chip, unit, title, desc |
| `flow-gate` | a step that can accept, confirm or annotate: a packet crosses a gate with options | node labels, `VERBS`, after-step chip |
| `flow-block` | the same flow when a check fails and the action is blocked | causes, stamp, setting line |
| `terminal-bars` | CLI output with per-row cost, size or score; flags in `--hot` | command, rows, total line (keep "SAMPLE DATA" if invented) |
| `file-cards` | a fallback or precedence between two files or sources | card names, chips, setting path |
| `terminal-window` | a command that opens another app or surface | command, flags, window label, result lines |
| `radar` | monitoring, watching, detection | command chip, caveat note, blip positions |

Every pattern file starts with a one-line comment naming itself; all strings are placeholders ("One sentence...", "item-a", `0.0.0`) so a forgotten string is obviously wrong, not subtly wrong.

## Writing a new pattern

1. Copy the closest pattern, keep `featureFrame` for index, version, headline and description.
2. Draw only inside `area` (952x800). Absolute positioning with `left/top` in px; node boxes 230x150, cards 420x300, terminal rows 28 px mono.
3. Schedule reveals with `rise`, `fade`, `prog` and the named easings; the last reveal ends by 3.5 s of a 4.5 s scene.
4. Set `n` (position) and the frame `TOTAL` (`scenes/frame.js`) by hand; check them on the rendered still.
5. Render a still at local 3.3 s and a second at 1.5 s; open both. Check overflow, overlap with the headline and empty boxes.

## Gotchas

- `typeInto` hides the element at `p = 0`; an element that must be visible before typing needs its own `fade`.
- `rise()` writes inline `opacity` and `transform`; a CSS class that sets opacity is overridden. Dim things with color instead.
- A glitch transition shows the outgoing scene only where the incoming scene's clip band excludes it, so content in the vertical middle is hidden at once; do not rely on it to reveal.
