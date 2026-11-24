// GitHub access through the `gh` CLI, GET only.
import { execFileSync } from "node:child_process";
import { die } from "./stats.mts";

export const RATE_FLOOR = 300;

export function ghGet(path: string, opts: { paginate?: boolean; missing?: boolean } = {}): any {
  const args = ["api", "--method", "GET", "-H", "Accept: application/vnd.github+json"];
  if (opts.paginate) args.push("--paginate", "--slurp");
  args.push(path);
  try {
    return JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] }));
  } catch (e) {
    const err = e as NodeJS.ErrnoException & { stderr?: string };
    if (err.code === "ENOENT") die("gh is not installed; install the GitHub CLI and run `gh auth login`");
    const stderr = String(err.stderr ?? "");
    if (opts.missing && /HTTP 40[4]|HTTP 422/.test(stderr)) return null;
    die(`gh api ${path.split("?")[0]} failed: ${stderr.trim().split("\n")[0] || err.message}`);
  }
}

export function ghText(path: string): string {
  try {
    return execFileSync("gh", ["api", "--method", "GET", path], { encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return die(`could not read ${path.split("?")[0]}`);
  }
}

export function checkRate(): number {
  const core = ghGet("rate_limit").resources.core as { remaining: number; reset?: number };
  if (core.remaining < RATE_FLOOR) {
    const at = new Date((core.reset ?? 0) * 1000).toISOString().slice(11, 16);
    die(`only ${core.remaining} GitHub API requests left (floor ${RATE_FLOOR}); they reset at ${at} UTC`);
  }
  return core.remaining;
}
