# Style (edit when you edit `src/style.css`)

Vertical 1080x1920, 30 fps. Deterministic render: no rAF, CSS animation, Date or Math.random.

| token | hex | role |
|---|---|---|
| `--bg` | `#050806` | background |
| `--ink` | `#d8ffe6` | text |
| `--phos` | `#5dffa0` | the one accent |
| `--dim` | `#2f7a52` | labels, borders, inactive |
| `--hot` | `#ff8a5b` | alert only |

- Type: mono for labels, terminals and counters; sans for headline (104-128 px) and body (44 px).
- Rhythm: 120 BPM, beat 0.5 s; durations are multiples of a beat; transition overlap 0.5 s.
- Easing: `outExpo` entrances, `outCubic` fades and fills, `inOutQuart` wipes, `inOutCubic` travel.
- Content: every claim traces to a primary source; sample data is labeled on screen.
