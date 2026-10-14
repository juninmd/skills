---
name: motion-video
description: |
  Make motion-graphics videos as code: HTML/CSS scenes rendered frame by frame with Chrome and ffmpeg, cut to a beat-locked soundtrack. Use for reels, shorts, product-news and kinetic-typography videos, 'a video like this reel', adding music to a render. Trigger on 'vídeo animado em código', 'render quadro a quadro', 'adiciona uma música', 'motion graphics reel'.
---

# Motion Video

**Not this skill:** web UI or components (`frontend-engineering`), interactive 3D scenes (`threejs`), 3D model assets (`3d-models`). Footage from an AI video model is a different tool, not this pipeline.

## Preflight

```bash
node -v && ffmpeg -version | head -n 1 && uv --version     # Node 20+, ffmpeg, uv (runs scripts/music.py)
ls src/engine scripts/render.mjs 2>/dev/null               # a project exists? edit it, do not re-scaffold
```

Chrome stable must be installed (`playwright-core` drives it with `channel: 'chrome'`, no browser download). The agent cannot hear audio: the final ear check belongs to the user.

## Workflow

1. **Gate zero.** Confirm topic, platform (default vertical 1080x1920, 30 fps, 30-45 s), language, audience, and where the claims come from. For a reference reel, read caption and comments in a real browser (a plain fetch hits the login wall), look at one frame, and say you never saw it move.
2. **Content before pixels.** Collect claims from a primary source and verify each yourself; a subagent's list is a lead, not evidence. Keep exact names and versions, drop dates you cannot confirm, label invented sample data on screen.
3. **Scaffold.** `node <skill>/scripts/scaffold.mjs <dir> --with <patterns>`, then `npm install`. Pick patterns in [scene-patterns.md](references/scene-patterns.md).
4. **Style first.** Fill `STYLE.md`: closed palette, type scale, grid, BPM, named easings ([style-system.md](references/style-system.md)). Asking for "a cool motion" yields a 2009 slide deck; constraints make it look designed.
5. **One scene per claim**, each with a different pattern. Build one, render a still at its late moment (local 3.3 s), open the PNG, fix overflow and overlap before the next.
6. **Music.** Choose the source from the table; the default is the generator locked to the cuts ([music.md](references/music.md)). A reel asked to have music never ships silent.
7. **Build and gate.** `npm run build`, then every gate in [qa-gates.md](references/qa-gates.md). Put the MP4 in front of the user and state what was measured but not seen or heard.

## Decisions

| Question | Choice | Why |
|---|---|---|
| Soundtrack | `scripts/music.py` (default) | beat-locked to the cuts, original so nothing to clear, reproducible by seed |
| | supplied or library track | only when the user gives it and the license is clear; match tempo; loudnorm |
| | AI-generated track (generator MCP) | paid credits: confirm cost first; must cover the full duration |
| Claim type | number -> `counter-bar`; flow -> `flow-gate` / `flow-block`; CLI output -> `terminal-bars`; fallback or precedence -> `file-cards`; command opens an app -> `terminal-window`; monitoring -> `radar` | one visual idea per claim, repeat a pattern at most twice |
| Engine | this one (HTML, frame stepping) | deterministic, one dependency; another tool only if the user already owns it |
| Aspect ratio | vertical 1080x1920 | other ratios need `style.css` and every layout edited |

## Commands

```bash
node <skill>/scripts/scaffold.mjs ./video --with counter-bar,terminal-bars,flow-gate && cd video && npm install
npm run still -- 1.5,6.3                     # PNGs in out/ at those seconds
npm run build                                # out/meta.json -> out/music.wav -> out/video.mp4 (~0.15 s/frame)
uv run scripts/music.py --meta out/meta.json --out out/music.wav --low-db -2 --seed 11   # retune the music only
npm run render -- --audio out/music.wav --out final.mp4
```

## Gotchas

- A transition overlays instead of replacing unless every scene has an opaque background; `.scene { background: inherit }` in `style.css` does it. Keep it.
- Every frame is a pure function of its index. rAF, CSS animation or transition, `Date`, `Math.random` break reproducibility; the symptom is two renders of one frame hashing differently.
- `ffmpeg -shortest` cuts the video when the audio is shorter: the pipeline pads the audio. ffmpeg RGB to yuv420p shifts colors unless tagged BT.709: the pipeline sets it through `-x264-params` (the `-color_*` flags alone leave primaries "unknown").
- A typed string is one character short on the exact frame its progress reaches 1.0 (float rounding). Look four frames later before calling it a bug.
- Text finishing after about 3.8 s of a 4.5 s scene sits under the next transition. `n/TOTAL` and `version` chips are manual: read them on the still.
- Fonts are system fonts (Consolas, Bahnschrift on Windows); another OS changes metrics, so re-check text fit there.

## Stop

- A claim has no primary source, or the source contradicts it.
- Chrome or ffmpeg is missing: report it; do not substitute a screen recording.
- Rights to a supplied track are unclear, or the user wants AI-generated footage instead of code-drawn motion.
- Any gate in `qa-gates.md` is red.

## Rules

- Durations are multiples of one beat (0.5 s at 120 BPM); the transition overlap is one beat, so every cut lands on a beat.
- Take cut times from `out/meta.json`, never by hand. Keep the generated `.part` and failure handling in `render.mjs`.
- Procedural music is original; any other track gets its license and source recorded in the project README.
- Report music as measured (loudness, peak, sync, spectrogram), never as "sounds good".
- Spend credits (generator MCPs, paid APIs) only after the user confirms the cost.

## Checklist

- [ ] Every claim traced to a primary source; sample data labeled; placeholders gone (`rg` gate).
- [ ] Late-moment still of every scene opened; no overflow, overlap or empty boxes.
- [ ] Mid-transition frames show replacement, not overlay.
- [ ] `ffprobe`: 1080x1920, 30 fps, `bt709`, frame count matches duration; audio and video both start at 0.
- [ ] Loudness -14 +/- 1 LUFS, decoded peak below -1 dBFS, spectrogram shows intro, drop, final impact.
- [ ] MP4 delivered to the user with the knobs to retune the music.
