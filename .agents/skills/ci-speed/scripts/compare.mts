// `compare`: before against after, medians, an exact interval, and one verdict.
import type { Excluded, Filters } from "./cohort.mts";
import { durations, loadCacheState, onBase, outsideCohort, runFailed, workflowMatches } from "./cohort.mts";
import type { Run } from "./runs.mts";
import { executed, latestJobs, readRuns, runMinutes, ts } from "./runs.mts";
import type { Rate } from "./stats.mts";
import { die, failsNeeded, failsRose, fmt, median, MIN_RUNS, P95_FIRM, pct, shiftInterval, TAIL_RUNS, tails } from "./stats.mts";

export interface CompareOpts extends Filters {
  before: string;
  after: string;
  minRuns: number;
  json?: boolean;
}

const labelSet = (labels?: string[]) => [...(labels ?? [])].sort().join(",");

function validate(a: CompareOpts, rb: Run[], ra: Run[]): void {
  if (a.cache && !a.cacheState) die("--cache needs --cache-state (a JSON map of run id to hit or miss)");
  const both = rb.map((r) => r.id).filter((id) => ra.some((r) => r.id === id));
  if (both.length) die(`${both.length} run(s) are on both sides, e.g. ${both[0]}; fetch the after side with --created`);
  if (a.workflow && ![...rb, ...ra].some((r) => workflowMatches(r, a.workflow))) die(`no run matches workflow ${JSON.stringify(a.workflow)} (give its name or file name)`);
  const names = new Set([...rb, ...ra].filter((r) => workflowMatches(r, a.workflow)).map((r) => r.path ?? r.name));
  if (names.size > 1) die(`runs from ${names.size} workflows; pass --workflow to compare one`);
  for (const [side, rs] of [["before", rb], ["after", ra]] as const) {
    if (new Set(rs.map((r) => r.id)).size !== rs.length) die(`the ${side} file repeats a run id`);
  }
  if (a.minRuns < MIN_RUNS) die(`--min-runs can't go below ${MIN_RUNS}: with fewer runs a side, a 95% interval can hardly or never rule out no change`);
  if (!a.label) {
    const labels = (rs: Run[]) => new Set(rs.flatMap((r) => latestJobs(r)).filter((j) => (!a.job || j.name === a.job) && j.labels?.length).map((j) => labelSet(j.labels)));
    if ([...labels(rb)].sort().join("|") !== [...labels(ra)].sort().join("|")) die("runner labels differ between before and after; pass --label (and --job) to compare the same runner");
  }
  // Each job must run on one set of runner labels, the same on both sides: a shift in which
  // runner a job lands on must not pass for a speedup.
  const cache = loadCacheState(a);
  const timed = (r: Run) => workflowMatches(r, a.workflow) && r.conclusion === "success" && !outsideCohort(r, a, cache);
  const jobLabels = (rs: Run[]) => {
    const seen = new Map<string, Set<string>>();
    for (const r of rs.filter(timed)) {
      for (const j of latestJobs(r)) {
        if ((a.job && j.name !== a.job) || !j.labels?.length || (a.label && !j.labels.includes(a.label))) continue;
        seen.set(j.name ?? "", (seen.get(j.name ?? "") ?? new Set()).add(labelSet(j.labels)));
      }
    }
    return seen;
  };
  const jb = jobLabels(rb);
  const ja = jobLabels(ra);
  for (const [side, seen] of [["before", jb], ["after", ja]] as const) {
    for (const [name, sets] of seen) {
      if (sets.size > 1) die(`job ${JSON.stringify(name)} ran on different runners within the ${side} runs (${[...sets].sort().join("; ")}), so a shift in the mix could pass for a speedup; pass --label with a label only one of them has`);
    }
  }
  for (const [name, sets] of jb) {
    const other = ja.get(name);
    if (other && [...sets][0] !== [...other][0]) die(`job ${JSON.stringify(name)} ran on ${[...sets][0]} before and ${[...other][0]} after; a runner change isn't a code speedup`);
  }
  if (!a.job) {
    const sets = new Set<string>();
    for (const r of [...rb, ...ra].filter(timed)) sets.add(JSON.stringify([...new Set(latestJobs(r).filter(executed).map((j) => labelSet(j.labels)))].sort()));
    if (sets.size > 1) die(`the timed runs ran on ${sets.size} different sets of runners, so a shift in the mix could pass for a speedup; pass --job to time one job, or --label with a label only one set has`);
  }
}

export function cmdCompare(a: CompareOpts): void {
  const rb = readRuns(a.before);
  const ra = readRuns(a.after);
  validate(a, rb, ra);
  const excluded: Excluded[] = [];
  const before = durations(rb, a, "before", excluded);
  const after = durations(ra, a, "after", excluded);
  const inWorkflow = (r: Run) => workflowMatches(r, a.workflow) && (!a.event || r.event === a.event) && onBase(r, a.base);
  const finished = (r: Run) => !["skipped", "neutral", null, undefined].includes(r.conclusion);
  const failRate = (rs: Run[]): Rate => {
    const done = rs.filter(inWorkflow).filter((r) => finished(r) && (r.conclusion !== "cancelled" || runFailed(r)));
    return [done.filter(runFailed).length, done.length];
  };
  const minutes = (rs: Run[]) => rs.filter(inWorkflow).filter(finished).map(runMinutes);
  const perDay = (rs: Run[], m: number[]) => {
    const days = rs.filter(inWorkflow).map((r) => ts(r.created_at)).filter((x): x is number => x !== null);
    const span = days.length > 1 ? (Math.max(...days) - Math.min(...days)) / 86400 : 0;
    return span >= 1 ? Math.round(m.reduce((s, x) => s + x, 0) / span) : null;
  };
  const fb = failRate(rb);
  const fa = failRate(ra);
  const mb = minutes(rb);
  const ma = minutes(ra);
  const fewer = Math.min(before.length, after.length);
  const [tb, ta] = tails(before, after);
  const what = a.job ? `job ${a.job}` : "run (start to last job done)";
  const runs = before.length === after.length ? `${before.length} runs a side` : `${before.length} runs before, ${after.length} after`;
  const sides = before.length === after.length ? `${before.length} a side` : `${before.length} before and ${after.length} after`;
  const rate = (f: Rate) => (f[1] ? f[0] / f[1] : 0);
  const res: Record<string, unknown> = {
    measure: what, before_runs: before.length, after_runs: after.length,
    before_median: median(before), after_median: median(after), before_p95: pct(before, 0.95), after_p95: pct(after, 0.95),
    before_tail: tb, after_tail: ta, p95_provisional: fewer < P95_FIRM, excluded,
    failed_before: fb, failed_after: fa,
    runner_minutes_median_before: median(mb), runner_minutes_median_after: median(ma),
    runner_minutes_a_day_before: perDay(rb, mb), runner_minutes_a_day_after: perDay(ra, ma),
  };
  let code: string;
  let verdict: string;
  let shift: ReturnType<typeof shiftInterval> | null = null;
  if (fewer < a.minRuns) {
    code = "not_enough_runs";
    verdict = `not enough runs yet (${runs}; ${a.minRuns} a side needed)`;
  } else if (failsRose(fb, fa)) {
    code = "not_valid";
    verdict = `not valid: more runs fail after (${fa[0]} of ${fa[1]}) than before (${fb[0]} of ${fb[1]})`;
  } else {
    shift = shiftInterval(before, after);
    res.shift_estimate = shift.estimate;
    res.shift_interval_95 = [shift.low, shift.high];
    res.shift_interval_confidence = Math.round(shift.confidence * 1e4) / 1e4;
    const moved = median(after)! - median(before)!;
    // The interval speaks for the median only when the medians moved the same way.
    if (shift.high < 0 && moved < 0 && rate(fa) > rate(fb)) {
      code = "faster_more_failures";
      verdict = `median faster (${runs}), but more runs failed after (${fa[0]} of ${fa[1]}) than before (${fb[0]} of ${fb[1]}): name each failure's cause before calling it faster`;
    } else if (shift.high < 0 && moved < 0) [code, verdict] = ["faster", `median faster (${runs})`];
    else if (shift.low > 0 && moved > 0) [code, verdict] = ["slower", `median slower (${runs})`];
    else if (shift.high < 0 || shift.low > 0) {
      code = "mixed";
      verdict = `mixed: after runs tend to be ${shift.high < 0 ? "faster" : "slower"}, but the median isn't (${runs})`;
    } else [code, verdict] = ["no_change_yet", `no measurable change yet with ${sides}; more runs can tighten this`];
  }
  const hidden = code === "not_enough_runs";
  if (hidden) {
    // No timings until there are enough runs, so a longer window is chosen without seeing them.
    for (const k of ["before_median", "after_median", "before_p95", "after_p95", "before_tail", "after_tail", "runner_minutes_median_before", "runner_minutes_median_after", "runner_minutes_a_day_before", "runner_minutes_a_day_after"]) res[k] = null;
  }
  res.verdict_code = code;
  res.verdict = verdict;
  if (a.json) return void console.log(JSON.stringify(res, (_k, v) => (typeof v === "number" && !Number.isFinite(v) ? String(v) : v), 2));
  console.log(`measure: ${what}${a.cache ? ` | cache: ${a.cache}` : ""}`);
  if (hidden) console.log(`before: ${before.length} runs\nafter:  ${after.length} runs\ntimings: not shown until there are ${a.minRuns} a side, so a longer window is chosen without seeing them`);
  else {
    console.log(`before: ${before.length} runs, median ${fmt(median(before))}, ${tb[0]} ${fmt(tb[1])}`);
    console.log(`after:  ${after.length} runs, median ${fmt(median(after))}, ${ta[0]} ${fmt(ta[1])}`);
    if (fewer < P95_FIRM) console.log(`${fewer >= TAIL_RUNS ? "slowest 5%" : "slowest runs"}: provisional, under ${P95_FIRM} runs a side`);
  }
  const need = failsNeeded(fb, fa[1] - fa[0]);
  const higher = rate(fa) > rate(fb) && !failsRose(fb, fa) ? " (higher after, within chance: report it)" : "";
  const beyond = need !== null && fa[0] < need ? `; beyond chance from ${need} failed beside these ${fa[1] - fa[0]}` : "";
  console.log(`failed runs: before ${fb[0]} of ${fb[1]}, after ${fa[0]} of ${fa[1]}${higher}${beyond}`);
  if (mb.length && ma.length && !hidden) {
    console.log(`runner-minutes per run (every job and attempt, cancelled runs included, rounded up per job): median ${median(mb)} before, ${median(ma)} after`);
    const [db, da] = [res.runner_minutes_a_day_before, res.runner_minutes_a_day_after];
    if (db && da) console.log(`runner-minutes a day: ${db} before, ${da} after (also moves with how many runs a day there are)`);
  }
  if (shift) console.log(`change, Hodges-Lehmann estimate ${fmt(shift.estimate)}; exact 95% interval (Mann-Whitney): ${fmt(shift.low)} to ${fmt(shift.high)}`);
  console.log(`verdict: ${verdict}`);
  if (excluded.length) {
    console.log(`left out (${excluded.length}):`);
    for (const [side, id, why] of excluded.slice(0, 30)) console.log(`  ${side.padEnd(6)} run ${id}: ${why}`);
    if (excluded.length > 30) console.log(`  ... and ${excluded.length - 30} more`);
  }
}
