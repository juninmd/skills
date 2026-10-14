# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy>=1.26"]
# ///
"""Beat-locked procedural soundtrack, synthesized from scratch: no samples, no license to clear.

uv run music.py --meta out/meta.json --out out/music.wav
uv run music.py --duration 40 --cuts 3,7,11 --bpm 120 --key A --mode minor --seed 7 --out music.wav
"""
import argparse, json, subprocess, sys, wave
from functools import lru_cache
from pathlib import Path

import numpy as np

SR, TAU = 44100, 2 * np.pi
PITCH = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
# (root offset in semitones, chord tones): i-VI-III-VII in minor, I-V-vi-IV in major
PROG = {
    "minor": [(0, (0, 3, 7)), (8, (0, 4, 7)), (3, (0, 4, 7)), (10, (0, 4, 7))],
    "major": [(0, (0, 4, 7)), (7, (0, 4, 7)), (9, (0, 3, 7)), (5, (0, 4, 7))],
}
ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 4, 3, 2, 1]
PHASES = np.random.default_rng(1).uniform(0, TAU, 64)


def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tvec(sec): return np.arange(int(sec * SR)) / SR


def shape(x, attack=0.003, release=0.012):
    a, r = max(1, int(attack * SR)), max(1, int(release * SR))
    x = x.copy()
    x[:a] *= np.linspace(0, 1, min(a, len(x)))
    x[-r:] *= np.linspace(1, 0, min(r, len(x)))
    return x


def fft_band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    gain = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(np.fft.rfft(x) * gain, len(x))


def sweep(x, fc):
    """Time-varying lowpass (STFT, Hann, hop N/4); fc is the cutoff in Hz per sample."""
    n, hop = 2048, 512
    win, f = np.hanning(n), np.fft.rfftfreq(n, 1 / SR)
    xp, out = np.concatenate([x, np.zeros(n)]), np.zeros(len(x) + n)
    for s in range(0, len(x), hop):
        c = fc[min(s + n // 2, len(x) - 1)]
        out[s:s + n] += np.fft.irfft(np.fft.rfft(xp[s:s + n] * win) / (1 + (f / c) ** 4), n) * win
    return out[: len(x)] / 1.5


def saw(f, dur, fc0, fc1=None, tau=0.1, detune=0.0, nh=24):
    """Band-limited saw by additive synthesis; the filter envelope is baked into the harmonic gains."""
    t = tvec(dur)
    fc = fc0 if fc1 is None else fc1 + (fc0 - fc1) * np.exp(-t / tau)
    out = np.zeros_like(t)
    for k in range(1, nh + 1):
        fk = f * k * (1 + detune)
        if fk > 15000: break
        out += np.sin(TAU * fk * t + PHASES[k]) / k / np.sqrt(1 + (fk / fc) ** 4)
    return out


@lru_cache(None)
def kick():
    t = tvec(0.45)
    body = np.sin(TAU * np.cumsum(44 + 120 * np.exp(-t * 32)) / SR) * np.exp(-t * 8)
    click = np.sin(TAU * 2800 * t) * np.exp(-t * 700) * 0.25
    return shape(np.tanh(1.7 * (body + click)) * 0.95, 0.001, 0.02)


@lru_cache(None)
def clap(seed=3):
    rng, t = np.random.default_rng(seed), tvec(0.3)
    out = np.zeros_like(t)
    for off in (0, 0.011, 0.023):
        i = int(off * SR)
        out[i:] += (fft_band(rng.standard_normal(len(t)), 900, 5000) * np.exp(-t * 90))[: len(t) - i]
    out += fft_band(rng.standard_normal(len(t)), 900, 4500) * np.exp(-t * 20) * 0.8
    return shape(np.tanh(out) * 0.7, 0.001, 0.02)


@lru_cache(None)
def hat(kind):
    rng, op = np.random.default_rng(10 + kind), kind == 2
    t = tvec(0.28 if op else 0.07)
    return shape(fft_band(rng.standard_normal(len(t)), 7500, 20000) * np.exp(-t * (14 if op else 55)), 0.0005, 0.01)


@lru_cache(None)
def bass(m):
    t = tvec(0.24)
    ph = TAU * np.cumsum(hz(m) * (1 + 0.5 * np.exp(-t * 60))) / SR
    return shape(np.tanh(1.5 * (np.sin(ph) + 0.4 * np.sin(2 * ph))) * np.exp(-t * 6), 0.004, 0.03)


@lru_cache(None)
def pluck(m, dark):
    fc0, fc1 = (1800, 700) if dark else (5200, 1500)
    a = saw(hz(m), 0.24, fc0, fc1, 0.07, 0.004) + saw(hz(m), 0.24, fc0, fc1, 0.07, -0.004)
    return shape(a * 0.5 * np.exp(-tvec(0.24) * 9), 0.002, 0.02)


@lru_cache(None)
def pad(ms, dur):
    x = sum(saw(hz(m), dur, 1400, nh=14, detune=d) for m in ms for d in (-0.003, 0.003))
    return shape(x / (len(ms) * 2), 0.6, 0.7)


@lru_cache(None)
def impact():
    rng, t = np.random.default_rng(5), tvec(2.4)
    sub = np.sin(TAU * np.cumsum(32 + 70 * np.exp(-t * 5)) / SR) * np.exp(-t * 1.8)
    air = sweep(rng.standard_normal(len(t)), 200 + 9000 * np.exp(-t * 2.2)) * np.exp(-t * 3.0)
    return shape(np.tanh(1.5 * (0.9 * sub + 0.9 * air)), 0.001, 0.05)


@lru_cache(None)
def riser(dur):
    rng, t = np.random.default_rng(6), tvec(dur)
    air = sweep(rng.standard_normal(len(t)), 250 * (40 ** (t / dur)))
    tone = np.sin(TAU * np.cumsum(180 * 8 ** (t / dur)) / SR) * 0.25
    return shape((air + tone) * (t / dur) ** 1.5, 0.01, 0.01)


@lru_cache(None)
def whoosh(dur):
    rng, t = np.random.default_rng(7), tvec(dur)
    return shape(sweep(rng.standard_normal(len(t)), 400 * (17 ** (t / dur))) * np.sin(np.pi * t / dur) ** 2, 0.01, 0.02)


class Mix:
    def __init__(self, n):
        self.n = n
        self.bus = {k: np.zeros((2, n), np.float32) for k in ("drums", "bass", "arp", "pad", "fx", "rev")}

    def put(self, bus, sig, t, pan=0.0, gain=1.0, send=0.0):
        i = int(round(t * SR))
        if i >= self.n: return
        sig = sig[: self.n - i]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        for name, g in ((bus, gain), ("rev", gain * send)):
            if g:
                self.bus[name][0, i:i + len(sig)] += sig * g * l
                self.bus[name][1, i:i + len(sig)] += sig * g * r


def duck_curve(times, n, depth, rel=0.12):
    d, win = np.ones(n, np.float32), int(rel * 5 * SR)
    sh = 1 - depth * np.exp(-np.arange(win) / (rel * SR))
    for t in times:
        seg = d[int(t * SR): int(t * SR) + win]
        np.minimum(seg, sh[: len(seg)], out=seg)
    return d


def ping_pong(x, delay, fb, taps=3):
    out, d = x.copy(), int(delay * SR)
    for k in range(1, taps + 1):
        sh = np.zeros_like(x); sh[:, k * d:] = x[:, : x.shape[1] - k * d]
        out += (sh[::-1] if k % 2 else sh) * fb ** k
    return out


def reverb(x, rt60=1.9, predelay=0.02):
    rng, n = np.random.default_rng(8), int(rt60 * 1.3 * SR)
    ir = rng.standard_normal((2, n)) * np.exp(-6.91 * np.arange(n) / SR / rt60)
    ir = np.stack([fft_band(c, 150, 5500) for c in ir])
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    size = 1 << (x.shape[1] + n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size, axis=1) * np.fft.rfft(ir, size, axis=1), size, axis=1)[:, : x.shape[1]]
    d = int(predelay * SR)
    return np.concatenate([np.zeros((2, d)), y[:, :-d]], axis=1)


def compose(a):
    beat = 60 / a.bpm
    step, bar, n = beat / 4, 4 * beat, int(a.duration * SR)
    mix, rng = Mix(n), np.random.default_rng(a.seed)
    cuts = sorted(round(c / beat) * beat for c in a.cuts)
    drop = cuts[0] if cuts else 2 * bar
    hit = int((a.duration - a.tail) / beat) * beat
    if not 2 * beat <= drop < hit: sys.exit(f"drop at {drop}s must fall between 2 beats and the final hit at {hit}s")
    prog, root, chord_len = PROG[a.mode], PITCH[a.key], a.chord_bars * bar
    lo, ar = 10 ** (a.low_db / 20), 10 ** (a.arp_db / 20)  # trims: kick+bass, arp

    def chord(t):
        off, tones = prog[0 if t < drop else int((t - drop) // chord_len) % 4]
        return root + off, tones

    # pads: tonic through the intro, then one chord per chord_bars bars
    marks = [0.0] + list(np.arange(drop, hit, chord_len)) + [hit]
    for s0, s1 in zip(marks[:-1], marks[1:]):
        m, tones = chord(s0)
        mix.put("pad", pad(tuple(48 + m + x for x in tones), round(s1 - s0 + 0.7, 3)), s0, gain=0.5 if s0 < drop else 0.36, send=0.3)

    kicks = []
    for s in range(int(hit / step)):
        t, b16 = s * step, s % 16
        m, tones = chord(t)
        notes = [tones[0], tones[1], tones[2], tones[0] + 12, tones[1] + 12]
        if t >= drop:
            if s % 4 == 0: mix.put("drums", kick(), t, gain=0.78 * lo); kicks.append(t)
            if s % 8 == 4: mix.put("drums", clap(), t, gain=0.58, send=0.35)
            if s % 4 == 2: mix.put("drums", hat(2 if b16 == 14 else 0), t, pan=0.25, gain=0.34)
            elif s % 2: mix.put("drums", hat(1), t, pan=-0.2, gain=0.07 + 0.06 * rng.random())
            if b16 in (2, 6, 10, 11, 14): mix.put("bass", bass(24 + m + (12 if b16 == 11 else 0)), t, gain=0.56 * lo)
            vel = 1.0 if s % 4 == 0 else 0.75 if s % 4 == 2 else 0.55
            mix.put("arp", pluck(60 + m + notes[ARP[b16]], False), t, pan=0.5 * np.sin(s * 0.9), gain=0.42 * vel * ar, send=0.12)
        elif s % 2 == 0:
            mix.put("arp", pluck(60 + m + notes[ARP[b16]], True), t, pan=0.4 * np.sin(s * 0.9), gain=0.34 * ar, send=0.2)
        if hit - 4 * step <= t < hit:  # last beat before the hit: clap roll
            mix.put("drums", clap(), t, gain=0.25 + 0.15 * (t - (hit - 4 * step)) / step, send=0.3)

    rl = min(4 * beat, drop)
    mix.put("fx", riser(round(rl, 3)), drop - rl, gain=0.5, send=0.2)
    mix.put("fx", impact(), drop, gain=0.8, send=0.3)
    for i, c in enumerate(cuts[1:]):
        if c < hit: mix.put("fx", whoosh(a.transition), c, pan=0.5 if i % 2 else -0.5, gain=0.3, send=0.3)
    m, tones = chord(0)
    mix.put("fx", impact(), hit, gain=0.9, send=0.35)
    mix.put("pad", pad(tuple(48 + root + x for x in prog[0][1]), 2.0), hit, gain=0.5, send=0.4)
    return mix, kicks, n


def render(a):
    mix, kicks, n = compose(a)
    b = mix.bus
    duck = duck_curve(kicks, n, 0.6)
    arp = ping_pong(b["arp"], 3 * 60 / a.bpm / 4, 0.38)
    dry = b["drums"] + b["fx"] + (b["bass"] * 0.9 + b["pad"] * 0.85 + arp * 0.8) * duck
    out = dry + 0.7 * reverb(b["rev"])
    out = np.tanh(out * 1.1) / np.tanh(1.1)
    fade = int(0.8 * SR)
    out[:, -fade:] *= np.cos(np.linspace(0, np.pi / 2, fade)) ** 2
    out[:, : int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    return out / np.abs(out).max() * 0.89


def write_wav(path, x):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1).T * 32767).astype("<i2").tobytes())


def loudnorm(src, dst, target=-14.0, tp=-1.5):
    """Two-pass EBU R128 loudnorm so the track lands at the platform target without pumping."""
    af = f"loudnorm=I={target}:TP={tp}:LRA=11"
    p1 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(src), "-af", af + ":print_format=json", "-f", "null", "-"],
                        capture_output=True, text=True, check=True)
    j, _ = json.JSONDecoder().raw_decode(p1.stderr[p1.stderr.rindex("{"):])  # ffmpeg prints more text after the block
    af2 = (f"{af}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
           f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-af", af2, "-ar", str(SR), str(dst)], check=True)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--meta", help="JSON from `render.mjs --meta`: duration, cuts, transition")
    p.add_argument("--duration", type=float)
    p.add_argument("--cuts", default="", help="comma-separated scene start times in seconds")
    p.add_argument("--transition", type=float, default=0.5)
    p.add_argument("--bpm", type=float, default=120)
    p.add_argument("--key", default="A", choices=PITCH)
    p.add_argument("--mode", default="minor", choices=PROG)
    p.add_argument("--chord-bars", type=int, default=2)
    p.add_argument("--tail", type=float, default=1.5, help="seconds after the final hit")
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--low-db", type=float, default=0, help="trim kick+bass in dB (negative = less low end)")
    p.add_argument("--arp-db", type=float, default=0, help="trim the arpeggio in dB")
    p.add_argument("--no-loudnorm", action="store_true")
    p.add_argument("--out", required=True)
    a = p.parse_args()
    meta = json.loads(Path(a.meta).read_text()) if a.meta else {}
    a.duration = a.duration or meta.get("duration")
    a.cuts = meta.get("cuts") or [float(c) for c in a.cuts.split(",") if c]
    a.transition = meta.get("transition", a.transition)
    if not a.duration: p.error("give --duration or --meta")
    for c in a.cuts:
        near = round(c / (60 / a.bpm)) * 60 / a.bpm
        if abs(c - near) > 0.005: print(f"warning: cut {c}s is off the {a.bpm:g} BPM grid (nearest {near:.3f}s)", file=sys.stderr)
    out = Path(a.out)
    raw = out.with_suffix(".raw.wav")
    write_wav(raw, render(a))
    if a.no_loudnorm: raw.replace(out)
    else: loudnorm(raw, out); raw.unlink()
    print(f"{out} ({a.duration:g}s, {a.bpm:g} BPM, {a.key} {a.mode})", file=sys.stderr)


if __name__ == "__main__":
    main()
