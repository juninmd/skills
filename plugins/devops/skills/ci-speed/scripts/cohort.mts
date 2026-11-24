// Which runs may be timed, and which count as failures. The failure check reads every
// finished run; the runner, job and cache filters only choose the runs that are timed.
import fs from "node:fs";
import path from "node:path";
import type { Job, Run } from "./runs.mts";
import { executed, FAILED, latestJobs, runWall, secs } from "./runs.mts";

export interface Filters {
  workflow?: string;
  job?: string;
  event?: string;
  base?: string;
  label?: string;
  cache?: string;
  cacheState?: string;
}

export const workflowMatches = (r: Run, wf?: string) => !wf || wf === r.name || wf === path.basename(r.path ?? "");

/** With --base: a pull request run whose recorded target is that branch alone, or a push to it. */
export function onBase(r: Run, base?: string): boolean {
  if (!base) return true;
  if ((r.event ?? "").startsWith("pull_request")) return JSON.stringify(r.pull_request_bases) === JSON.stringify([base]);
  return r.head_branch === base;
}

export const loadCacheState = (a: Filters): Record<string, string> =>
  a.cacheState ? (JSON.parse(fs.readFileSync(a.cacheState, "utf8")) as Record<string, string>) : {};

/** With --label: evidence a run can be timed on that runner. */
export function onRunner(r: Run, a: Filters): boolean {
  if (a.job) return (r.jobs ?? []).some((j) => j.name === a.job && executed(j) && (j.labels ?? []).includes(a.label!));
  const ran = latestJobs(r).filter(executed);
  return ran.length > 0 && ran.every((j) => (j.labels ?? []).includes(a.label!));
}

/** Why a run can't be one of the timed runs (ignoring its outcome), or null. */
export function outsideCohort(r: Run, a: Filters, cache: Record<string, string>): string | null {
  if (a.event && r.event !== a.event) return `event ${r.event}`;
  if (!onBase(r, a.base)) return `not on branch ${a.base}`;
  if (a.cache && cache[String(r.id)] !== a.cache) return `cache ${cache[String(r.id)] ?? "state unknown"}`;
  if (a.label && !onRunner(r, a)) {
    return a.job ? `job ${a.job} not on runner ${a.label}` : `not every job on runner ${a.label} (pass --job to measure one job)`;
  }
  return null;
}

/** The run failed, any job in any attempt failed, or it was rerun. */
export function runFailed(r: Run): boolean {
  const jobsFailed = (r.jobs ?? []).some((j) => FAILED.includes(j.conclusion ?? ""));
  if (r.conclusion === "cancelled") return jobsFailed;
  return r.conclusion !== "success" || (r.run_attempt ?? 1) > 1 || jobsFailed;
}

function failedSomewhere(r: Run, a: Filters): boolean {
  if (r.conclusion !== "success" || (r.run_attempt ?? 1) > 1) return true;
  return (r.jobs ?? []).some((j) => FAILED.includes(j.conclusion ?? "") && (!a.job || j.name === a.job));
}

export type Excluded = [side: string, id: number, why: string];

export function durations(runs: Run[], a: Filters, side: string, excluded: Excluded[]): number[] {
  const vals: number[] = [];
  const cache = loadCacheState(a);
  for (const r of runs) {
    if (!workflowMatches(r, a.workflow)) continue;
    let why = outsideCohort(r, a, cache);
    if (!why && r.conclusion !== "success") why = `conclusion ${r.conclusion}`;
    if (!why && failedSomewhere(r, a)) why = "a failed or rerun attempt";
    let d: number | null = null;
    if (!why) {
      if (a.job) {
        const js: Job[] = latestJobs(r).filter((j) => j.name === a.job && (!a.label || (j.labels ?? []).includes(a.label)));
        const where = a.label ? ` on runner ${a.label}` : "";
        if (!js.length) why = `no job ${a.job}${where}`;
        else if (js.length > 1) why = `${js.length} jobs named ${a.job}${where}; can't tell which to time`;
        else if (js[0].conclusion !== "success") why = `job ${js[0].conclusion}`;
        else d = secs(js[0].started_at, js[0].completed_at);
      } else d = runWall(r);
    }
    if (!why && d !== null && d <= 0) why = "zero duration";
    if (why || d === null) excluded.push([side, r.id, why ?? "no timing"]);
    else vals.push(d);
  }
  return vals;
}
