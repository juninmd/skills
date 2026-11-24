// Run records as `measure.mts fetch` writes them (one JSON object per line) and the
// timing helpers every command shares.
import fs from "node:fs";
import { die } from "./stats.mts";

export interface Step {
  name?: string | null;
  conclusion?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface Job {
  id: number;
  name?: string | null;
  run_attempt?: number;
  conclusion?: string | null;
  created_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  labels?: string[];
  runner_name?: string | null;
  steps?: Step[];
}

export interface Run {
  id: number;
  name?: string | null;
  path?: string | null;
  event?: string | null;
  status?: string | null;
  head_branch?: string | null;
  head_sha?: string | null;
  run_attempt?: number;
  head_message?: string;
  head_repo?: string | null;
  conclusion?: string | null;
  created_at?: string | null;
  run_started_at?: string | null;
  updated_at?: string | null;
  pull_requests?: number[];
  pull_request_bases?: (string | undefined)[];
  jobs?: Job[];
}

const STAMP = /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(\.\d+)?(Z|[+-]\d\d:?\d\d)?$/;

/** GitHub timestamps to epoch seconds; null for a missing one. */
export function ts(value?: string | null): number | null {
  if (!value) return null;
  const m = STAMP.exec(value);
  if (!m) die(`unreadable timestamp ${JSON.stringify(value)}; use YYYY-MM-DDTHH:MM:SSZ`);
  const zone = !m[3] || m[3] === "Z" ? "Z" : m[3].length === 5 ? `${m[3].slice(0, 3)}:${m[3].slice(3)}` : m[3];
  return Date.parse(`${m[1]}${zone}`) / 1000 + (m[2] ? Number(m[2]) : 0);
}

export function secs(start?: string | null, end?: string | null): number | null {
  const a = ts(start);
  const b = ts(end);
  return a === null || b === null ? null : Math.max(0, b - a);
}

export function readRuns(path: string): Run[] {
  return fs
    .readFileSync(path, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as Run);
}

/** Jobs of the run's final attempt. */
export function latestJobs(run: Run): Job[] {
  const att = run.run_attempt ?? 1;
  const jobs = (run.jobs ?? []).filter((j) => (j.run_attempt ?? 1) === att);
  return jobs.length ? jobs : (run.jobs ?? []);
}

/** Seconds from the run's start to the last job done. */
export function runWall(run: Run): number | null {
  const start = run.run_started_at ?? run.created_at;
  const done = latestJobs(run).filter((j) => j.completed_at);
  if (!done.length) return secs(start, run.updated_at);
  return Math.max(...done.map((j) => secs(start, j.completed_at) ?? 0));
}

export function slowestJob(run: Run): Job | null {
  const done = latestJobs(run).filter((j) => j.completed_at);
  if (!done.length) return null;
  return done.reduce((a, b) => ((ts(b.completed_at) ?? 0) > (ts(a.completed_at) ?? 0) ? b : a));
}

/** Runner-minutes of one run: every job and attempt rounded up to the minute, as billed. */
export function runMinutes(r: Run): number {
  let total = 0;
  for (const j of r.jobs ?? []) {
    const d = secs(j.started_at, j.completed_at);
    if (d) total += Math.ceil(d / 60);
  }
  return total;
}

/** A job that ran, not one skipped (a skipped job never gets a runner). */
export function executed(j: Job): boolean {
  return j.conclusion !== "skipped" && Boolean(j.started_at);
}

export const FAILED = ["failure", "timed_out", "startup_failure"];

export function prKey(r: Run): string {
  return JSON.stringify(r.pull_requests?.length ? r.pull_requests : [r.head_repo, r.head_branch]);
}

export function inc<K>(m: Map<K, number>, k: K, by = 1): void {
  m.set(k, (m.get(k) ?? 0) + by);
}
