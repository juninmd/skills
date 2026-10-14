# Music

Open at the audio step, or when the user asks for music or "trilha". The agent cannot hear. Measurements prove structure, loudness and sync; whether it sounds good is the user's call, so hand over the file and the knobs below.

## Source

| Source | Use when | Cost and risk |
|---|---|---|
| `scripts/music.py` (default) | any reel with a known timeline | free, original (nothing to clear), reproducible by `--seed`; synthesized, so electronic only |
| User-supplied or library track | the user names or supplies one | record license and URL in the project README; tempo must match the cuts (see Other tempo) |
| AI-generated track (a generator MCP) | the user wants a different genre | paid credits: state the cost and confirm first; length at least the video; then loudnorm |

Never use audio ripped from someone else's reel.

## Procedural generator

```bash
npm run meta                                   # out/meta.json: duration, cuts, transition
uv run scripts/music.py --meta out/meta.json --out out/music.wav
npm run render -- --audio out/music.wav --out final.mp4
```

What it builds for a 120 BPM A-minor timeline, all on the beat grid:

- **Intro** (start to first cut): pad on the tonic, a dark 8th-note pluck, a noise riser over the last four beats.
- **Drop** (first cut): impact, then four-on-the-floor kick, clap on 2 and 4, off-beat hats, off-beat bass, 16th arpeggio, pad chord changing every `--chord-bars` bars (i-VI-III-VII, or I-V-vi-IV in major). Bass, pad and arp duck under the kick.
- **Every later cut**: a short whoosh over the transition.
- **End**: a clap roll, then an impact on the last beat before `duration - --tail`, pad stab, reverb tail and an 0.8 s fade.
- Master: soft clip, two-pass `loudnorm` to -14 LUFS, TP -1.5 dB. Output 44.1 kHz stereo WAV.

| Flag | Default | Effect |
|---|---|---|
| `--meta` | none | reads duration, cuts, transition from `render.mjs --meta` (or pass `--duration`, `--cuts 3,7,11`) |
| `--bpm` | 120 | tempo; cuts are snapped to its beat grid and the script warns when one is off by more than 5 ms |
| `--key`, `--mode` | A, minor | root note and `minor` or `major` (major sounds brighter) |
| `--chord-bars` | 2 | bars per chord; 2 bars is 4 s at 120 BPM, the same as one scene |
| `--tail` | 1.5 | seconds after the final impact |
| `--seed` | 7 | noise texture and hat humanization; re-roll for another take |
| `--low-db`, `--arp-db` | 0 | trim kick+bass or the arpeggio in dB |
| `--no-loudnorm` | off | keep the raw peak-normalized WAV |

Translate the user's reaction into flags: "too much bass" -> `--low-db -3`; "arp too quiet or too loud" -> `--arp-db +3` or `-3`; "darker, more serious" -> `--key F --mode minor`; "happier" -> `--mode major`; "another feel" -> `--seed`. Regenerate the music only (about 6 s); do not re-render frames, then re-mux with `npm run render -- --audio ...` or, for an already rendered silent video, `ffmpeg -i video.mp4 -i out/music.wav -map 0:v -map 1:a -c:v copy -af apad -c:a aac -b:a 192k -shortest final.mp4`.

## Sync rules

- Scene durations are multiples of the beat and the transition overlap equals one beat, so each cut falls on a beat. `--meta` hands the cuts to the generator; do not type them by hand.
- The first scene sets the intro length: it must be at least two beats and the drop (first cut) must come before the final impact.
- `apad` in the mux keeps a short track from truncating the video; `-shortest` alone would. Keep both.

## Other tempo

For a supplied track at another BPM, set `TR` in `engine/timeline.js` to one beat (`60 / bpm`) and make every `dur` a multiple of it, then trim the track: `ffmpeg -i in.mp3 -t <duration> -af "afade=t=out:st=<duration-1.5>:d=1.5,loudnorm=I=-14:TP=-1.5:LRA=11" out.wav`. Align the first downbeat with the first cut by offsetting the track (`-ss` to cut into it, or pad silence with `adelay`).

## Verify

Loudness, peak, container sync and the spectrogram are in [qa-gates.md](qa-gates.md). Report them with the explicit statement that the track was measured, not heard.
