# Style system

Open before writing `STYLE.md` for a new video. The reel this skill was derived from said it plainly: asking a model for "a cool motion" gives a 2009 slide deck; the right references (typography, grid, rhythm, easing, palette) are what make it look designed. Fix them first, then build scenes inside them.

## Palette (closed: add no color)

| token | hex | role |
|---|---|---|
| `--bg` | `#050806` | background, near black with a green cast |
| `--ink` | `#d8ffe6` | body text, first headline line |
| `--phos` | `#5dffa0` | the one accent: second headline line, rules, live state |
| `--dim` | `#2f7a52` | labels, borders, inactive |
| `--hot` | `#ff8a5b` | alert only: kicker, failure, flagged item |

One accent plus one alert. A second accent, a gradient or a white card breaks the system; change the whole table instead (edit `:root` in `style.css`).

## Type and layout

- Mono (labels, terminals, counters): 22-30 px labels in caps with +0.18em tracking; terminals 28 px; counters 120-170 px.
- Sans (headline, body): headline 104 px (feature) or 128 px (hook, outro), weight 600, -0.02em; body 44 px. Glow (`text-shadow`) only on the headline.
- At 952 px of usable width, body fits about 43 characters per line. Headline: two lines at most. Body: two lines at most. Anything under 40 px is decoration, never information.
- 64 px outer margin; background grid 90 px drifting 14 px/s; feature frame: index and version at y=250, headline y=330, free `area` 952x800 at y=930.
- Constant HUD (`hud.js`): corner labels, timecode, progress bar, scanlines, vignette. It signals "made as code" and hides nothing; keep it under the scenes' text.

## Rhythm and easing

- 120 BPM: beat 0.5 s. Scene durations are multiples of a beat (hook 3.5 s, features 4.5 s, outro 4.5 s). Transition overlap equals one beat, so every scene starts on a beat and a soundtrack can hit every cut.
- Reveal schedule inside a 4.5 s scene: index 0.05, headline from 0.15, body 0.7, visual 0.9-2.0, payoff 2.4-3.4, hold at least 0.5 s before the next transition starts at 4.0 s.
- Named easings only: `outExpo` entrances and counters, `outCubic` fades and bar fills, `inOutQuart` wipes and rules, `inOutCubic` travel between nodes, `track()` for multi-stop paths.

## Transitions

- `cut` for the first scene; alternate `glitch` and `wipe` afterwards. Both are applied to the incoming scene and need opaque scene backgrounds (already in `style.css`).
- A transition longer than one beat feels slow at this scene length; shorter ones read as a glitch in the video.

## Content rules

- One claim per scene, each with a different visual pattern ([scene-patterns.md](scene-patterns.md)). Repeat a pattern at most twice.
- Every claim traces to a primary source and shows the exact name or version. Drop dates you cannot confirm. Label invented sample data on screen ("SAMPLE DATA").
- The outro names the source of the claims.

## Anti-patterns

- A centered stack of bullets on a flat background.
- Bounce or elastic easing everywhere; more than one entrance style per scene.
- Text that finishes typing after 3.8 s of a 4.5 s scene: the next transition covers it.
- Restyling a scene without restyling the palette table: the video stops reading as one piece.
