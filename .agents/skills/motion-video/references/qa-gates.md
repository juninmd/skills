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
