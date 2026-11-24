// Exact, dependency-free statistics for comparing CI run durations.
// Adapted from joggernaut (MIT), see ../references/NOTICE.md.

export const MIN_RUNS = 5; // below 5 a side, no 95% interval can rule out "no change"
export const TAIL_RUNS = 20; // under this, "slowest 5%" is just the slowest run
export const P95_FIRM = 100;

export type Tail = [label: string, seconds: number | null];

export function die(msg: string, code = 2): never {
  process.stderr.write(`measure.mts: ${msg}\n`);
  process.exit(code);
}

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function pct(xs: number[], p: number): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const k = (s.length - 1) * p;
  const lo = Math.floor(k);
  const hi = Math.min(lo + 1, s.length - 1);
  return s[lo] + (s[hi] - s[lo]) * (k - lo);
}

export function tail(xs: number[]): Tail {
  if (xs.length < TAIL_RUNS) return ["slowest run", xs.length ? Math.max(...xs) : null];
  return ["slowest 5%", pct(xs, 0.95)];
}

export function comb(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let r = 1n;
  for (let i = 1; i <= Math.min(k, n - k); i++) r = (r * BigInt(n - i + 1)) / BigInt(i);
  return r;
}

/** Both sides' tails, like with like: from TAIL_RUNS runs a side each side's slowest 5%;
 * below, the smaller side's slowest run and the typical slowest of that many on the larger. */
export function tails(before: number[], after: number[]): [Tail, Tail] {
  const k = Math.min(before.length, after.length);
  if (k === 0 || k >= TAIL_RUNS) return [tail(before), tail(after)];
  const at = (xs: number[]): Tail => {
    const s = [...xs].sort((a, b) => a - b);
    const n = s.length;
    let j = k;
    while (2n * comb(j, k) < comb(n, k)) j++;
    return [n === k ? "slowest run" : `typical slowest of ${k}`, s[j - 1]];
  };
  return [at(before), at(after)];
}

export function fmt(s: number | null | undefined): string {
  if (s === null || s === undefined || Number.isNaN(s)) return "-";
  const sign = s < 0 ? "-" : "";
  const a = Math.abs(s);
  if (a < 60) return `${sign}${a.toFixed(1)}s`;
  const r = Math.round(a);
  return `${sign}${Math.floor(r / 60)}m ${String(r % 60).padStart(2, "0")}s`;
}

/** counts[u]: how many of the C(m+n, m) equally likely orders have exactly u pairs where the
 * after run is slower. Coefficients of the Gaussian binomial, so exact integers. */
export function mannWhitneyCounts(m0: number, n0: number, upto: number): bigint[] {
  const m = Math.min(m0, n0);
  const n = Math.max(m0, n0);
  const c: bigint[] = [1n, ...new Array<bigint>(upto).fill(0n)];
  for (let i = 1; i <= m; i++) {
    const top = Math.min(i * n, upto);
    const a = n + i;
    for (let idx = top; idx >= a; idx--) c[idx] -= c[idx - a];
    for (let r = 0; r < i; r++) for (let idx = r + i; idx <= top; idx += i) c[idx] += c[idx - i];
  }
  return c;
}

export interface Shift {
  estimate: number;
  low: number;
  high: number;
  confidence: number;
}

/** Hodges-Lehmann shift of `after` against `before` with its exact Mann-Whitney interval
 * (Bauer 1972) at 95%. Bounds are infinite when the samples are too small for any interval. */
export function shiftInterval(before: number[], after: number[]): Shift {
  const m = before.length;
  const n = after.length;
  const total = comb(m + n, m);
  let k = 0;
  let below = 0n;
  for (const c of mannWhitneyCounts(m, n, Math.floor((m * n) / 2))) {
    if ((below + c) * 40n > total) break; // P(U <= k-1) <= alpha/2 with alpha = 1/20
    below += c;
    k++;
  }
  const d: number[] = [];
  for (const x of before) for (const y of after) d.push(y - x);
  d.sort((a, b) => a - b);
  const estimate = (d[(d.length - 1) >> 1] + d[d.length >> 1]) / 2;
  if (k === 0) return { estimate, low: -Infinity, high: Infinity, confidence: 1 };
  const confidence = 1 - Number((2n * below * 1000000n) / total) / 1e6;
  return { estimate, low: d[k - 1], high: d[d.length - k], confidence };
}

export type Rate = [failed: number, done: number];

/** One-sided Fisher exact test at 5%: did the failure rate rise beyond chance? */
export function failsRose(fb: Rate, fa: Rate): boolean {
  const [xb, nb] = fb;
  const [xa, na] = fa;
  if (!nb || !na || xa * nb <= xb * na) return false;
  const k = xb + xa;
  const total = nb + na;
  let j = Math.max(0, k - na);
  let term = comb(nb, j) * comb(na, k - j);
  let sum = term;
  while (j < xb) {
    term = (term * BigInt(nb - j) * BigInt(k - j)) / (BigInt(j + 1) * BigInt(na - k + j + 1));
    j++;
    sum += term;
  }
  return sum * 20n < comb(total, k);
}

/** The fewest failed runs after, beside `passed` green ones, that failsRose counts; null if none. */
export function failsNeeded(fb: Rate, passed: number): number | null {
  if (fb[0] >= fb[1]) return null;
  const rose = (x: number) => failsRose(fb, [x, passed + x]);
  let hi = 1;
  while (!rose(hi)) hi *= 2;
  let lo = 0;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rose(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}
