// Runs a re-test needs to show an unchanged flake. Double precision (log space), which is
// ample for batches up to thousands of runs; the bound is shown rounded down.
import { die } from "./stats.mts";

function logFactorials(n: number): number[] {
  const f = [0];
  for (let i = 1; i <= n; i++) f.push(f[i - 1] + Math.log(i));
  return f;
}

/** Low end of the two-sided 95% exact interval for the rate, given x failures of n runs. */
export function lowEnd(x: number, n: number): number {
  const lf = logFactorials(n);
  const atLeast = (p: number): number => {
    const terms: number[] = [];
    for (let i = x; i <= n; i++) {
      terms.push(lf[n] - lf[i] - lf[n - i] + i * Math.log(p) + (n - i) * Math.log1p(-p));
    }
    const top = Math.max(...terms);
    return Math.exp(top) * terms.reduce((s, t) => s + Math.exp(t - top), 0);
  };
  const target = 0.025;
  if (x === n) return target ** (1 / n);
  if (x === 1) return 1 - (1 - target) ** (1 / n);
  let lo = 0;
  let hi = x / n;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    if (atLeast(mid) < target) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function flakeBound(x: number, n: number): { rate: number; need: number } {
  if (n < 1 || x < 0 || x > n) die("need 0 <= failures <= runs and runs >= 1");
  const raw = lowEnd(x, n);
  if (!(raw > 0)) die(`the rate's low end is too small to work with at ${n} runs`);
  const scale = 10 ** (5 - Math.floor(Math.log10(raw)));
  const rate = Math.floor(raw * scale) / scale; // 6 significant digits, rounded down
  if (rate >= 1) return { rate, need: 1 };
  const lq = Math.log1p(-rate);
  const l05 = Math.log(0.05);
  let need = Math.ceil(l05 / lq);
  while (need * lq > l05) need++;
  while (need > 1 && (need - 1) * lq <= l05) need--;
  return { rate, need };
}
