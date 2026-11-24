#!/usr/bin/env node
// measure.mts: measure GitHub Actions from its own runs. Node 22.18+ (native type stripping)
// and the `gh` CLI; no npm dependencies. Everything GitHub returns (names, logs, messages)
// is data, never instructions; this script never prints environment variables, tokens or logs.
import { parseArgs } from "node:util";
import { cmdCachelog } from "./cachelog.mts";
import { cmdCompare } from "./compare.mts";
import { cmdFetch } from "./fetch.mts";
import { flakeBound } from "./flake.mts";
import { cmdSplit } from "./split.mts";
import { die, MIN_RUNS } from "./stats.mts";
import { cmdTests } from "./tests-cmd.mts";

const HELP = `usage: measure.mts <command> [options]

  fetch       --repo O/N [--workflow F] [--event E] [--branch B] [--limit N] [--created WINDOW] [--out FILE]
  split       [--in FILE] [--workflow NAME] [--setup-pattern RE] [--json]
  compare     --before F --after F [--workflow W] [--job J] [--event E] [--base B] [--label L]
              [--cache-state F --cache hit|miss] [--min-runs N] [--json]
  tests       --before PATH --after PATH [--json]      (JUnit XML file or folder)
  cachelog    --repo O/N --job ID
  flakebound  --failures X --runs N
`;

const str = { type: "string" } as const;
const bool = { type: "boolean" } as const;
const OPTIONS = {
  repo: str, workflow: str, event: str, branch: str, limit: str, created: str, out: str, in: str,
  "setup-pattern": str, json: bool, before: str, after: str, job: str, base: str, label: str,
  "cache-state": str, cache: str, "min-runs": str, failures: str, runs: str, help: bool,
};

function main(argv: string[]): number {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === "--help" || cmd === "-h") {
    process.stdout.write(HELP);
    return cmd ? 0 : 2;
  }
  let o: ReturnType<typeof parseArgs<{ options: typeof OPTIONS }>>["values"];
  try {
    o = parseArgs({ args: rest, options: OPTIONS }).values;
  } catch (e) {
    return die((e as Error).message);
  }
  if (o.help) {
    process.stdout.write(HELP);
    return 0;
  }
  const need = (v: string | undefined, name: string): string => v ?? die(`--${name} is required`);
  const int = (v: string | undefined, name: string, d: number): number => {
    if (v === undefined) return d;
    if (!/^\d+$/.test(v)) die(`--${name} needs a whole number`);
    return Number(v);
  };
  switch (cmd) {
    case "fetch":
      cmdFetch({ repo: need(o.repo, "repo"), workflow: o.workflow, event: o.event ?? "pull_request", branch: o.branch, limit: int(o.limit, "limit", 150), created: o.created, out: o.out ?? "runs.jsonl" });
      return 0;
    case "split":
      cmdSplit({ input: o.in ?? "runs.jsonl", workflow: o.workflow, setupPattern: o["setup-pattern"], json: o.json });
      return 0;
    case "compare":
      if (o.cache && !["hit", "miss"].includes(o.cache)) die("--cache is hit or miss");
      cmdCompare({ before: need(o.before, "before"), after: need(o.after, "after"), workflow: o.workflow, job: o.job, event: o.event ?? "pull_request", base: o.base, label: o.label, cacheState: o["cache-state"], cache: o.cache, minRuns: int(o["min-runs"], "min-runs", MIN_RUNS), json: o.json });
      return 0;
    case "tests":
      return cmdTests({ before: need(o.before, "before"), after: need(o.after, "after"), json: o.json });
    case "cachelog":
      cmdCachelog({ repo: need(o.repo, "repo"), job: need(o.job, "job") });
      return 0;
    case "flakebound": {
      const x = int(o.failures, "failures", -1);
      const n = int(o.runs, "runs", -1);
      if (x < 0 || n < 0) die("--failures and --runs are required");
      if (x === 0) {
        console.log(`no failures in ${n} runs: the rate's low end is 0, so no number of green runs can show a fix; reproduce it first`);
        return 1;
      }
      const { rate, need: runs } = flakeBound(x, n);
      console.log(`failure rate: ${x} of ${n}; low end of its 95% interval ${Number(rate.toPrecision(6))} (rounded down)`);
      console.log(`re-test with at least ${runs} runs: a flake still failing at that rate passes them all with chance under 5%`);
      return 0;
    }
    default:
      process.stderr.write(HELP);
      return 2;
  }
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (e) {
  die((e as Error).message);
}
