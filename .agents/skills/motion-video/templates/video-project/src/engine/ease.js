export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;

// progress of t inside [start, start + dur], clamped to 0..1
export const prog = (t, start, dur) => clamp((t - start) / dur);

export const ease = {
  linear: p => p,
  outCubic: p => 1 - (1 - p) ** 3,
  outExpo: p => (p === 1 ? 1 : 1 - 2 ** (-10 * p)),
  inOutCubic: p => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2),
  inOutQuart: p => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2),
  outBack: p => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2,
};

// piecewise-eased interpolation through [time, value] stops
export function track(t, stops, fn = ease.inOutCubic) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [t1, v1] = stops[i];
    const [t0, v0] = stops[i - 1];
    if (t <= t1) return lerp(v0, v1, fn((t - t0) / (t1 - t0)));
  }
  return stops.at(-1)[1];
}

// stateless mulberry32: same seed, same value, so every frame is reproducible
export function rand(seed) {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
