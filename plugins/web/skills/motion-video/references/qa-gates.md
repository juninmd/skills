# QA gates

Open before delivering. Each gate is a command with an expected result; a red gate blocks delivery. Run from the project root; `$V` is the final MP4.

## Contents
1. Determinism
2. Scenes, late moment
3. Transitions
4. Container and color
5. Audio
6. Claims and leftovers
7. Failure path
8. Review pass: craft measures, phone contact sheet, ranked notes

## 1. Determinism
```bash
npm run still -- 6.3 && sha256sum out/still-6.3.png | cut -c1-16
npm run still -- 6.3 && sha256sum out/still-6.3.png | cut -c1-16     # same hash twice
```
A different hash means time-dependent code: rAF, CSS animation, `Date`, `Math.random`.

## 2. Scenes, late moment
```bash
npm run meta && npm run still -- $(node -e "const m=require('./out/meta.json');console.log([0,...m.cuts].map(c=>c+3.3).join(','))")
```
Open every PNG. Look for text wider than 952 px, text under the headline overlapping the visual, empty bordered boxes, a typed string cut off, a wrong `n/TOTAL` or version chip.

## 3. Transitions
```bash
EXPR=$(node -e "const m=require('./out/meta.json');console.log(m.cuts.map(c=>'eq(n,'+Math.round((c+0.25)*m.fps)+')').join('+'))")
N=$(node -e "console.log(require('./out/meta.json').cuts.length)")
ffmpeg -v error -y -i "$V" -vf "select='$EXPR',scale=270:-1,tile=${N}x1" -frames:v 1 -vsync 0 out/transitions.png
```
Each tile is a frame a quarter-second into a transition: the incoming scene must replace the outgoing one, never overlay it (ghosted double headlines mean a scene lost its opaque background).

## 4. Container and color
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_frames,color_space,color_transfer,color_primaries:format=duration -of default=nw=1 "$V"
```
Expect h264, 1080x1920, 30/1, yuv420p, `nb_frames = duration x 30`, and `bt709` in all three color fields. Color fidelity: read one solid pixel from a still and from the same MP4 frame; the RGB must agree within about 6 levels.
```bash
ffmpeg -v error -i out/still-6.png -vf "crop=8:8:X:Y,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 - | od -An -tu1
ffmpeg -v error -i "$V" -vf "select=eq(n\,180),crop=8:8:X:Y,scale=1:1" -frames:v 1 -vsync 0 -f rawvideo -pix_fmt rgb24 - | od -An -tu1
```

## 5. Audio
```bash
ffprobe -v error -show_entries stream=codec_type,start_time,duration -of csv=p=0 "$V"          # both start 0; durations within 0.05 s
ffmpeg -hide_banner -nostats -i "$V" -vn -af ebur128=peak=true -f null - 2>&1 | rg -A14 Summary | rg "I:|Peak:"   # I = -14 +/- 1 LUFS
ffmpeg -hide_banner -nostats -i "$V" -vn -af astats=measure_overall=Peak_level -f null - 2>&1 | rg "Peak level dB" | tail -n 1   # below -1 dBFS after AAC
ffmpeg -v error -y -i out/music.wav -lavfi "showspectrumpic=s=1400x520:legend=1:scale=log:fscale=log" out/spectrum.png
```
Open the spectrogram: quiet dark intro, a visible riser into the first cut, steady low-end from the drop, an impact on the last beat, a decaying tail. Then say plainly that the track was measured, not heard.

## 6. Claims and leftovers
```bash
rg -n "item-a|node A|label-text|One sentence|0\.0\.0|SERIES NAME|Headline line|SAMPLE DATA" src
```
Placeholders must be gone; `SAMPLE DATA` stays only next to invented numbers. Re-open the primary source for every claim on screen and confirm name, version and wording. A subagent's list is a lead, not evidence.

## 7. Failure path (after changing `render.mjs`)
```bash
node scripts/render.mjs --audio does-not-exist.mp3 --out neg.mp4; echo "exit=$?"; ls out | rg neg || echo clean
```
Expect a non-zero exit, ffmpeg's real error ("No such file or directory") and no leftover `neg.mp4` or `.part`.

## 8. Review pass
Gates 1-7 catch what is broken; this pass catches what is weak. You wrote the timeline, so you know what each scene means; the viewer sees it once, at full speed, on a phone. Run it on every new video and after any edit that moves timing or layout, before delivering.

**Measure first.** Each is a question, not a verdict: fix it, or keep it on purpose and say why in the notes.
```bash
ffmpeg -hide_banner -nostats -i "$V" -vf "freezedetect=n=-60dB:d=3" -map 0:v:0 -f null - 2>&1 | rg "freeze_(start|duration)"   # empty: no 3 s stretch where nothing moves
ffmpeg -v error -i "$V" -vf "select=eq(n\,0),signalstats,metadata=print:file=-" -frames:v 1 -f null - | rg "YMIN|YMAX"     # frame 0 is the thumbnail: YMAX-YMIN under ~16 means it is blank
rg -no "font-size:\s*\d+px" src | awk -F'[: ]+' '{v=$NF; sub("px","",v); if (v+0 < 28) print}'                       # text under 28 px (2.6% of 1080) is unreadable on a phone unless it is chrome
```
Reading time: count the words a viewer must read in each scene and divide by the seconds they stay fully visible (entrance done, before the next transition). Above about 3 words per second, cut words or extend the scene by a beat.

**Then look, at phone width.** One sheet: frame 0, then each scene 1 s after it starts and at its late moment, scaled to 360 px wide — the size most viewers see.
```bash
EXPR=$(node -e "const m=require('./out/meta.json');const t=[0,...[0,...m.cuts].flatMap(c=>[c+1,c+3.3])];console.log(t.map(s=>'eq(n,'+Math.round(s*m.fps)+')').join('+'))")
R=$(node -e "const m=require('./out/meta.json');console.log(Math.ceil((1+2*(m.cuts.length+1))/4))")
ffmpeg -v error -y -i "$V" -vf "select='$EXPR',scale=360:-1,tile=4x${R}:padding=8:color=white" -frames:v 1 -vsync 0 out/contact-360.png
```
Open it and, for each scene, ask in turn:

| Question | Catches |
|---|---|
| Can a stranger say what this frame shows in one sentence? | a visual that needs its narration to make sense |
| Is every line meant to be read legible at 360 px? | thin weights, low-contrast `--dim` text, long mono strings |
| Is there one focal point? | headline and visual competing; the eye has nowhere to land |
| Does it sit inside the frame? | text at the edge or in the zones platform UI covers (top bar, caption and buttons at the bottom right) |
| With the words covered, do the frames still tell the story in order? | scenes that repeat one idea, or a payoff that never lands |
| Does it look designed, not default? | the same pattern three times, every element easing on one curve, centered everything |

Trust the numbers where they disagree with your eye: a clipped chip or a 1 s line looks fine on a contact sheet.

**Write ranked notes**, one line each — `t=<s> | scene / element | problem -> exact change | what stays` — into `out/review.md`:
- **P0** breaks the read or the claim: unreadable, wrong, cut off, blank thumbnail. Fix all before delivery.
- **P1** weakens the video: a dead stretch, a soft final scene, a cut that jumps. Fix the ones worth their time.
- **P2** polish. List them; the user decides.

Fix text first, then timing, then detail; re-render only the stills you changed and re-run the measures. Never score the video out of 10 — a score names nothing to fix. When a sub-agent is available, give it only `STYLE.md` and `out/contact-360.png` and ask for P0 and P1 lines in the same format; a reviewer who knows the code reads intent instead of pixels. Close with the delivery note: what was measured, what was only looked at, what nobody checked (the audio was measured, not heard), and the weakest scene.

Review pass adapted in part from heygen-com/hyperframes (Apache-2.0, © 2026 HeyGen, Inc.).
