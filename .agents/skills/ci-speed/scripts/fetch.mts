// `fetch`: completed runs and their jobs into a JSONL file. GET calls only.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { checkRate, ghGet } from "./gh.mts";
import type { Run } from "./runs.mts";
import { ts } from "./runs.mts";
import { die } from "./stats.mts";

export const WORK_DIR = ".ci-speed";

export interface FetchOpts {
  repo: string;
  workflow?: string;
  event?: string;
  branch?: string;
  limit: number;
  created?: string;
  out: string;
}

const git = (...a: string[]) => spawnSync("git", a, { encoding: "utf8" });

/** Create the output folder; keep it untracked and out of the repository's commits. */
export function prepareOut(out: string): void {
  const inside = git("rev-parse", "--is-inside-work-tree").status === 0;
  const tracked = inside ? git("ls-files", "--error-unmatch", out).status : 1;
  if (!inside) {
    for (let here = path.resolve("."); ; here = path.dirname(here)) {
      if (fs.existsSync(path.join(here, ".git")) || fs.existsSync(path.join(here, ".jj"))) {
        die(`this looks like a git repository, but git can't say whether ${out} is tracked; not writing it`);
      }
      if (path.dirname(here) === here) break;
    }
  }
  if (tracked === 0) die(`${out} is tracked by git; write measurements to an untracked file`);
  if (tracked !== 1) die(`git couldn't say whether ${out} is tracked; not writing it`);
  if (out.replaceAll("\\", "/").split("/").includes("..")) die(`${out} contains '..'; give the output path without it`);
  let here = path.resolve(".");
  for (const part of path.relative(here, path.resolve(out)).split(path.sep)) {
    here = path.join(here, part);
    if (fs.existsSync(here) && fs.lstatSync(here).isSymbolicLink()) die(`${here} is a symbolic link; write to a real, untracked folder`);
  }
  fs.mkdirSync(path.dirname(out) || ".", { recursive: true });
  if (!path.normalize(out).split(path.sep).includes(WORK_DIR)) return;
  const ex = git("rev-parse", "--git-path", "info/exclude");
  if (ex.status !== 0) return;
  const file = ex.stdout.trim();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const lines = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n") : [];
  if (!lines.includes(`${WORK_DIR}/`)) fs.appendFileSync(file, `\n${WORK_DIR}/\n`);
}

/** The end of a --created window as epoch seconds; null when it has no end. */
export function windowEnd(created: string): number | null {
  if (created.startsWith(">")) return null;
  const end = created.split("..").at(-1)!.replace(/^<=?/, "");
  if (end === "" || end === "*") return null;
  if (/^\d{4}-\d\d-\d\d$/.test(end)) return ts(`${end}T00:00:00Z`)! + 86400;
  return ts(end);
}

function prBases(a: FetchOpts, r: any): (string | undefined)[] {
  const listed: any[] = r.pull_requests ?? [];
  const headRepo = r.head_repository?.full_name;
  if (listed.length || !String(r.event ?? "").startsWith("pull_request") || !r.head_branch || headRepo !== a.repo) {
    return listed.map((p) => p.base?.ref);
  }
  const head = encodeURIComponent(`${a.repo.split("/")[0]}:${r.head_branch}`);
  const prs: any[] = ghGet(`repos/${a.repo}/pulls?state=all&per_page=100&head=${head}`, { missing: true }) ?? [];
  return [...new Set(prs.map((p) => p.base?.ref as string | undefined))].sort();
}

function toRecord(a: FetchOpts, r: any): Run {
  const pages: any[] = ghGet(`repos/${a.repo}/actions/runs/${r.id}/jobs?filter=all&per_page=100`, { paginate: true });
  return {
    id: r.id, name: r.name, path: r.path, event: r.event, head_branch: r.head_branch, head_sha: r.head_sha,
    run_attempt: r.run_attempt ?? 1,
    head_message: String(r.head_commit?.message ?? "").split("\n")[0].slice(0, 200),
    head_repo: r.head_repository?.full_name, conclusion: r.conclusion, created_at: r.created_at,
    run_started_at: r.run_started_at, updated_at: r.updated_at,
    pull_requests: (r.pull_requests ?? []).map((p: any) => p.number),
    pull_request_bases: prBases(a, r),
    jobs: pages.flatMap((p) => p.jobs ?? []).map((j: any) => ({
      id: j.id, name: j.name, run_attempt: j.run_attempt ?? 1, conclusion: j.conclusion,
      created_at: j.created_at, started_at: j.started_at, completed_at: j.completed_at,
      labels: j.labels ?? [], runner_name: j.runner_name,
      steps: (j.steps ?? []).map((s: any) => ({ name: s.name, conclusion: s.conclusion, started_at: s.started_at, completed_at: s.completed_at })),
    })),
  };
}

export function cmdFetch(a: FetchOpts): void {
  if (a.created) {
    const end = windowEnd(a.created);
    if (end === null || end > Date.now() / 1000) {
      die(`the window ${a.created} hasn't ended; give a closed one (START..END, or <=END for a baseline), so the runs in it are fixed before you look`);
    }
  }
  const left = checkRate();
  let base = `repos/${a.repo}/actions`;
  base += a.workflow ? `/workflows/${a.workflow}/runs` : "/runs";
  // With a window, list every run in it: fast runs finish first, so reading a window
  // with runs still going would keep only the fastest and could pass for a speedup.
  let q = a.created ? "per_page=100" : "status=completed&per_page=100";
  if (a.event) q += `&event=${encodeURIComponent(a.event)}`;
  if (a.branch) q += `&branch=${encodeURIComponent(a.branch)}`;
  if (a.created) q += `&created=${encodeURIComponent(a.created)}`;
  let runs: any[] = [];
  const seen = new Set<number>();
  let total: number | undefined;
  for (let page = 1; runs.length < a.limit; page++) {
    const data = ghGet(`${base}?${q}&page=${page}`);
    total ??= data.total_count;
    if (!data.workflow_runs?.length) break;
    const batch = data.workflow_runs.filter((r: any) => !seen.has(r.id));
    batch.forEach((r: any) => seen.add(r.id));
    runs.push(...batch);
  }
  if (a.created) {
    const whole = !a.created.trim().startsWith("<");
    if (whole && ((total ?? 0) > a.limit || runs.length > a.limit)) {
      die(`the window holds ${Math.max(total ?? 0, runs.length)} runs, more than --limit ${a.limit}; raise --limit or choose a shorter window`);
    }
    const want = whole ? (total ?? 0) : Math.min(total ?? 0, a.limit);
    if (runs.length < want) die(`GitHub listed ${runs.length} of the ${want} runs asked for (at most 1,000 for a filtered query); ${whole ? "choose a shorter window" : "lower --limit to 1,000 or less"}`);
    runs = runs.slice(0, a.limit);
    const going = runs.filter((r) => r.status !== "completed");
    if (going.length) {
      die(`${going.length} of the ${runs.length} runs created in this window haven't finished (the fastest finish first); fetch the same window again once they have. A run stuck before it started won't finish: ask a person to cancel it`);
    }
  }
  runs = runs.slice(0, a.limit);
  if (2 * runs.length + 10 > left) die(`${runs.length} runs need up to ${2 * runs.length + 10} requests; ${left} left`);
  prepareOut(a.out);
  const lines: string[] = [];
  runs.forEach((r, i) => {
    if (i && i % 50 === 0) {
      checkRate();
      process.stderr.write(`  ${i} of ${runs.length} runs read\n`);
    }
    lines.push(JSON.stringify(toRecord(a, r)));
  });
  const tmp = path.join(path.dirname(a.out) || ".", `.measure-${process.pid}.partial`);
  fs.writeFileSync(tmp, lines.map((l) => `${l}\n`).join(""));
  fs.renameSync(tmp, a.out);
  console.log(`wrote ${runs.length} runs to ${a.out}`);
}
