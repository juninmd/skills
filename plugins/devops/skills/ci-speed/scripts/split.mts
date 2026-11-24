// `split`: where the time goes on the slowest path, runner-minutes, reruns that turned green.
import type { Job, Run } from "./runs.mts";
import { inc, latestJobs, prKey, readRuns, runMinutes, runWall, secs, slowestJob, ts } from "./runs.mts";
import { die, fmt, median, P95_FIRM, pct, tail } from "./stats.mts";

const SETUP_WORDS = ["set up", "setup", "checkout", "cache", "restore", "install", "download", "login", "toolchain", "dependencies", "deps"];
const CATCH_UP = /^Merge (?:branch|remote-tracking branch) '[^']+'(?: of \S+)? into /;
const cleanupStep = (n: string) => n.startsWith("post ") || n === "complete job";

export interface Split {
  waiting: number;
  setup: number;
  running: number;
  cleanup: number;
  other: number;
  total: number;
  upstream?: number;
}

export function isSetup(name: string, pattern?: RegExp): boolean {
  const n = name.toLowerCase();
  if (cleanupStep(n)) return false;
  return pattern ? pattern.test(n) : SETUP_WORDS.some((w) => n.includes(w));
}

export function jobSplit(job: Job, pattern?: RegExp): Split {
  const total = secs(job.started_at, job.completed_at) ?? 0;
  const waiting = secs(job.created_at, job.started_at) ?? 0;
  let setup = 0;
  let running = 0;
  let cleanup = 0;
  for (const s of job.steps ?? []) {
    const d = secs(s.started_at, s.completed_at);
    if (d === null) continue;
    const n = (s.name ?? "").toLowerCase();
    if (cleanupStep(n)) cleanup += d;
    else if (isSetup(n, pattern)) setup += d;
    else running += d;
  }
  return { waiting, setup, running, cleanup, other: Math.max(0, total - setup - running - cleanup), total };
}

const num = (xs: (number | undefined)[]) => xs.filter((x): x is number => x !== undefined);

/** Per commit: from the first run's push to the last job done, where every workflow passed. */
function acrossWorkflows(runs: Run[]): number[] {
  const bySha = new Map<string, Run[]>();
  for (const r of runs) {
    if (["pull_request", "pull_request_target"].includes(r.event ?? "") && r.head_sha) {
      const k = `${prKey(r)}|${r.head_sha}`;
      bySha.set(k, [...(bySha.get(k) ?? []), r]);
    }
  }
  const out: number[] = [];
  for (const group of bySha.values()) {
    const sorted = [...group].sort((a, b) => ts(a.created_at)! - ts(b.created_at)!);
    const t0 = ts(sorted[0].created_at)!;
    const first = new Map<string, Run>();
    for (const x of sorted) if (ts(x.created_at)! - t0 <= 86400 && !first.has(x.name ?? "")) first.set(x.name ?? "", x);
    const rs = [...first.values()];
    if (rs.length > 1 && rs.every((x) => x.conclusion === "success")) {
      const start = Math.min(...rs.map((x) => ts(x.created_at)!));
      const ends = rs.flatMap((x) => latestJobs(x).filter((j) => j.completed_at).map((j) => ts(j.completed_at)!));
      if (ends.length) out.push(Math.max(...ends) - start);
    }
  }
  return out;
}

function rerunFlakes(runs: Run[]): [string, number][] {
  const flakes = new Map<string, number>();
  for (const r of runs) {
    const byName = new Map<string, Job[]>();
    for (const j of r.jobs ?? []) {
      const k = JSON.stringify([j.name, [...(j.labels ?? [])].sort()]);
      byName.set(k, [...(byName.get(k) ?? []), j]);
    }
    for (const [k, js] of byName) {
      // Only a pass in a later attempt than a failure counts: two same-name legs are not a rerun.
      const failed = js.filter((j) => ["failure", "timed_out"].includes(j.conclusion ?? "")).map((j) => j.run_attempt ?? 1);
      if (failed.length && js.some((j) => j.conclusion === "success" && (j.run_attempt ?? 1) > Math.min(...failed))) {
        const [name, labs] = JSON.parse(k) as [string, string[]];
        inc(flakes, JSON.stringify([r.path ?? r.name ?? "", r.name ?? "", name ?? "", labs]));
      }
    }
  }
  const files = new Map<string, Set<string>>();
  for (const k of flakes.keys()) {
    const [p, wf, job, labs] = JSON.parse(k) as [string, string, string, string[]];
    const id = JSON.stringify([wf, job, labs]);
    files.set(id, (files.get(id) ?? new Set()).add(p));
  }
  return [...flakes]
    .map(([k, n]): [string, number] => {
      const [p, wf, job, labs] = JSON.parse(k) as [string, string, string, string[]];
      const many = files.get(JSON.stringify([wf, job, labs]))!.size > 1;
      return [`${wf}${many ? ` (${p})` : ""} / ${job} [${labs.join(",") || "no labels"}]`, n];
    })
    .sort((a, b) => b[1] - a[1]);
}

export function summarize(runs: Run[], setupPattern?: RegExp) {
  const ok = runs.filter((r) => r.conclusion === "success");
  const walls = num(ok.map((r) => runWall(r) ?? undefined));
  const names = new Set(runs.map((r) => r.name ?? ""));
  const cross = names.size > 1 ? acrossWorkflows(runs) : [];
  const starts = runs.map((r) => ts(r.created_at)).filter((x): x is number => x !== null).sort((a, b) => a - b);
  const spanDays = starts.length > 1 ? (starts.at(-1)! - starts[0]) / 86400 : 0;
  const commits = new Set(runs.filter((r) => r.event === "pull_request").map((r) => `${prKey(r)}|${r.head_sha}`));

  const keys = ["upstream", "waiting", "setup", "running", "cleanup", "other"] as const;
  const path: Record<(typeof keys)[number], number[]> = { upstream: [], waiting: [], setup: [], running: [], cleanup: [], other: [] };
  const pathJobs = new Map<string, number>();
  const perJob = new Map<string, Split[]>();
  for (const r of ok) {
    const sj = slowestJob(r);
    if (sj) {
      const sp = jobSplit(sj, setupPattern);
      sp.upstream = secs(r.run_started_at ?? r.created_at, sj.created_at) ?? 0;
      for (const k of keys) path[k].push(sp[k] ?? 0);
      inc(pathJobs, sj.name ?? "");
    }
    for (const j of latestJobs(r)) {
      const k = `${r.name} / ${j.name}`;
      perJob.set(k, [...(perJob.get(k) ?? []), jobSplit(j, setupPattern)]);
    }
  }
  const jobs = [...perJob].map(([job, sps]) => ({
    job, runs: sps.length,
    waiting: median(sps.map((s) => s.waiting)), setup: median(sps.map((s) => s.setup)),
    running: median(sps.map((s) => s.running)), total: median(sps.map((s) => s.total)),
  })).sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  const mins = { success: 0, failure: 0, cancelled: 0, other: 0 };
  const byLabel = new Map<string, number>();
  for (const r of runs) {
    for (const j of r.jobs ?? []) {
      const d = secs(j.started_at, j.completed_at);
      if (!d) continue;
      const c = j.conclusion === "timed_out" ? "failure" : j.conclusion;
      const m = Math.ceil(d / 60);
      mins[(c && c in mins ? c : "other") as keyof typeof mins] += m;
      inc(byLabel, [...(j.labels ?? [])].sort().join(",") || "unknown", m);
    }
  }
  const totalMin = Object.values(mins).reduce((a, b) => a + b, 0) || 1;
  const lost = runs.filter((r) => ["failure", "timed_out", "cancelled"].includes(r.conclusion ?? "")).reduce((s, r) => s + runMinutes(r), 0);
  const perPr = new Map<string, Set<string | null | undefined>>();
  for (const r of runs) if (r.event === "pull_request") perPr.set(prKey(r), (perPr.get(prKey(r)) ?? new Set()).add(r.head_sha));
  const counts = [...perPr.values()].map((v) => v.size);
  const catchUp = runs.filter((r) => CATCH_UP.test(r.head_message ?? ""));
  return {
    runs: runs.length, wait_median: median(walls), wait_p95: pct(walls, 0.95), wait_tail: tail(walls),
    p95_provisional: walls.length < P95_FIRM, successful_runs: walls.length,
    workflows: [...names].sort(), wait_all_workflows_median: median(cross), wait_all_workflows_tail: cross.length ? tail(cross) : null,
    wait_all_workflows_commits: cross.length, span_days: Math.round(spanDays * 10) / 10, pr_commits: commits.size,
    runs_per_day: spanDays >= 1 && commits.size ? Math.round((commits.size / spanDays) * 10) / 10 : null,
    slowest_path_split: Object.fromEntries(keys.map((k) => [k, median(path[k])])) as Record<string, number | null>,
    slowest_path_jobs: [...pathJobs].sort((a, b) => b[1] - a[1]), jobs,
    runner_minutes: mins, runner_minutes_by_label: Object.fromEntries(byLabel), wasted_share: lost / totalMin,
    pushes_per_pr_median: median(counts), pushes_per_pr_max: counts.length ? Math.max(...counts) : null,
    catch_up_runs: catchUp.length, catch_up_share: catchUp.reduce((s, r) => s + runMinutes(r), 0) / totalMin,
    catch_up_known: runs.some((r) => r.head_message), rerun_flakes: rerunFlakes(runs),
  };
}

export function cmdSplit(a: { input: string; workflow?: string; setupPattern?: string; json?: boolean }): void {
  const runs = readRuns(a.input).filter((r) => !a.workflow || r.name === a.workflow);
  if (!runs.length) die("no runs to read");
  const o = summarize(runs, a.setupPattern ? new RegExp(a.setupPattern) : undefined);
  if (a.json) return void console.log(JSON.stringify(o, null, 2));
  const [label, value] = o.wait_tail;
  console.log(`runs read: ${o.runs}${a.workflow ? ` (workflow ${a.workflow})` : ""}, over ${o.span_days} days` +
    (o.pr_commits === 0 ? " (no pull-request runs)" : o.runs_per_day === null ? " (under a day: no daily rate)" : `, about ${o.runs_per_day} pushes a day`));
  console.log(`PR wait (run start to last job done, ${o.successful_runs} successful runs): median ${fmt(o.wait_median)}, ${label} ${fmt(value)}` +
    (o.p95_provisional ? ` (provisional: under ${P95_FIRM} runs)` : ""));
  if (o.workflows.length > 1) {
    console.log(o.wait_all_workflows_tail
      ? `PR wait across workflows (${o.workflows.length} in the file; ${o.wait_all_workflows_commits} commits): median ${fmt(o.wait_all_workflows_median)}, ${o.wait_all_workflows_tail[0]} ${fmt(o.wait_all_workflows_tail[1])}`
      : "PR wait across workflows: no commit has passing runs of two or more workflows here");
  }
  const sp = o.slowest_path_split;
  const sum = Object.values(sp).reduce<number>((acc, v) => acc + (v ?? 0), 0) || 1;
  console.log("slowest path, median split (upstream: run start until the last job was queued):");
  for (const k of ["upstream", "waiting", "setup", "running", "cleanup", "other"]) {
    console.log(`  ${k.padEnd(8)} ${fmt(sp[k]).padStart(9)}  ${String(Math.round((100 * (sp[k] ?? 0)) / sum)).padStart(3)}%`);
  }
  console.log(`job that finishes last: ${o.slowest_path_jobs.slice(0, 3).map(([n, c]) => `${n} (${c} runs)`).join(", ")}`);
  console.log("jobs by median total (top 10):");
  for (const j of o.jobs.slice(0, 10)) {
    console.log(`  ${j.job.slice(0, 48).padEnd(48)} n=${String(j.runs).padEnd(4)} wait ${fmt(j.waiting).padEnd(8)} setup ${fmt(j.setup).padEnd(8)} run ${fmt(j.running).padEnd(8)} total ${fmt(j.total)}`);
  }
  const m = o.runner_minutes;
  console.log(`runner-minutes, every job rounded up to the minute: ${m.success + m.failure + m.cancelled + m.other} (passed ${m.success}, failed or timed out ${m.failure}, cancelled ${m.cancelled}, other ${m.other})`);
  console.log(`  in runs that failed, timed out or were cancelled: ${Math.round(100 * o.wasted_share)}%`);
  console.log(`  by runner label (unweighted; price each label to get dollars): ${Object.entries(o.runner_minutes_by_label).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  console.log(o.pushes_per_pr_max ? `pushes per PR: median ${o.pushes_per_pr_median}, max ${o.pushes_per_pr_max}` : "pushes per PR: no pull-request runs in this file");
  console.log(o.catch_up_known
    ? `catch-up runs, by commit message (rebases can't be seen): ${o.catch_up_runs} runs, ${Math.round(100 * o.catch_up_share)}% of runner-minutes`
    : "catch-up runs: unknown (these runs were saved without commit messages)");
  if (o.rerun_flakes.length) {
    console.log("jobs that failed then passed on a rerun, same commit:");
    for (const [k, n] of o.rerun_flakes.slice(0, 10)) console.log(`  ${k}  ${n}`);
  }
}
