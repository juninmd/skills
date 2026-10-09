# Motion video project

Scenes are HTML written as code; every frame is a pure function of the frame index, rendered by Chrome and encoded by ffmpeg.

```
npm install
npm run still -- 1.5,6.3     # PNG stills at those seconds -> out/still-<t>.png
npm run meta                 # out/meta.json: duration and scene cuts
npm run music                # out/music.wav, locked to the cuts (needs uv)
npm run build                # meta -> music -> out/video.mp4 with audio
npm run render               # silent video only
```

- `src/config.js`: fps and HUD labels. `src/scenes/index.js`: playback order. `STYLE.md`: the design rules for this video.
- Scene = `{ id, dur, transition, build(root) -> update(t) }`; keep `dur` a multiple of one beat (0.5 s at 120 BPM).
- Needs Node 20+, ffmpeg, installed Chrome. `scripts/music.py --help` lists tempo, key, mode and mix trims.
