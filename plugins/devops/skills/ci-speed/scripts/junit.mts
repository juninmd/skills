// JUnit reports to a by-name outcome map. A test is its report's path (shard numbers
// blanked), its suites, class, file and name, so a lost test can't hide behind a new one.
import fs from "node:fs";
import path from "node:path";
import type { El } from "./xml.mts";
import { local, parseXml, walk } from "./xml.mts";
import { die, } from "./stats.mts";
import { inc } from "./runs.mts";

export type Outcome = "passed" | "failed" | "errored" | "skipped";

const SHARD = /((?:shard|part|chunk|split|slice|group|batch|worker|index|node-index)[-_ ]?)\d+(?:[-_ ]?of[-_ ]?\d+)?/gi;
const NOT_RUN = new Set(["notrun", "skipped", "suppressed", "disabled", "ignored", "pending"]);
const FAILED_TAGS = new Set(["failure", "error", "flakyFailure", "flakyError", "rerunFailure", "rerunError"]);
const RETRY_TAGS = new Set(["flakyFailure", "flakyError", "rerunFailure", "rerunError"]);
const ASSERT_WORDS = new Set(["failed", "failure", "fail"]);
const ERROR_WORDS = new Set(["error", "errored", "broken"]);

export function caseOutcome(tc: El): Outcome {
  const kids = new Set(tc.kids.map((c) => local(c.tag)));
  const status = (tc.attrs.status ?? "").toLowerCase();
  const result = (tc.attrs.result ?? "").toLowerCase();
  if (kids.has("failure")) return "failed";
  if (kids.has("error")) return "errored";
  if (kids.has("skipped")) return "skipped";
  if (ASSERT_WORDS.has(status) || ASSERT_WORDS.has(result)) return "failed";
  if (ERROR_WORDS.has(status) || ERROR_WORDS.has(result)) return "errored";
  if (NOT_RUN.has(status) || NOT_RUN.has(result)) return "skipped";
  return "passed";
}

function files(p: string): string[] {
  if (!fs.statSync(p).isDirectory()) return [p];
  const out: string[] = [];
  for (const e of fs.readdirSync(p, { withFileTypes: true, recursive: true })) {
    if (e.isFile() && e.name.endsWith(".xml")) out.push(path.join(e.parentPath, e.name));
  }
  return out.sort();
}

const chainOf = (e: El, tags: string[]) => {
  const out: El[] = [];
  for (let x: El | null = e; x; x = x.parent) if (tags.includes(local(x.tag))) out.push(x);
  return out.reverse();
};

export interface Results {
  tests: Map<string, Outcome[]>;
  errors: Map<string, number>;
  executed: number;
}

export function junitResults(p: string): Results {
  const tests = new Map<string, Outcome[]>();
  const errors = new Map<string, number>();
  let executed = 0;
  const isDir = fs.statSync(p).isDirectory();
  for (const f of files(p)) {
    let root: El;
    try {
      root = parseXml(fs.readFileSync(f, "utf8"));
    } catch {
      return die(`not JUnit XML: ${f}`);
    }
    const where = (isDir ? path.relative(p, f) : "").replace(/\.xml$/, "").replace(SHARD, (_m, g: string) => `${g}#`);
    const all = [...walk(root)];
    const suites = all.filter((e) => local(e.tag) === "testsuite");
    let cases = 0;
    for (const suite of suites.length ? suites : [root]) {
      const chain = chainOf(suite, ["testsuite"]);
      const suitePath = chain.map((s) => s.attrs.name ?? "");
      const suiteFile = [...chain].reverse().find((s) => s.attrs.file)?.attrs.file ?? "";
      for (const c of suite.kids) {
        if (FAILED_TAGS.has(local(c.tag))) inc(errors, JSON.stringify([where, suitePath, suiteFile, local(c.tag), c.attrs.type ?? ""]));
      }
      for (const tc of suite.kids.filter((c) => local(c.tag) === "testcase")) {
        cases++;
        const out = caseOutcome(tc);
        const id = [where, suitePath, tc.attrs.classname ?? "", tc.attrs.file ?? suiteFile, tc.attrs.name ?? ""];
        const retried = tc.kids.filter((g) => RETRY_TAGS.has(local(g.tag))).length;
        if (retried) inc(errors, JSON.stringify([...id, "(retried)"]), retried);
        if (out === "passed" || out === "failed") executed++;
        const key = JSON.stringify(id);
        tests.set(key, [...(tests.get(key) ?? []), out]);
      }
    }
    if (!cases) die(`no test cases in ${f}; is it a JUnit report?`);
    declared(f, all, where, errors);
  }
  return { tests, errors, executed };
}

/** Every container's declared errors/failures that no case or suite element explains. */
function declared(f: string, all: El[], where: string, errors: Map<string, number>): void {
  const count = (e: El, k: string) => {
    const v = (e.attrs[k] ?? "").trim();
    if (!v) return 0;
    if (!/^\d+$/.test(v)) die(`${f}: unreadable ${k}=${JSON.stringify(e.attrs[k])}; the comparison is unverified`);
    return Number(v);
  };
  for (const e of all.filter((x) => ["testsuite", "testsuites"].includes(local(x.tag)))) {
    const chain = chainOf(e, ["testsuite", "testsuites"]).map((x) => x.attrs.name ?? local(x.tag));
    const efile = e.attrs.file ?? "";
    if (local(e.tag) === "testsuites") {
      for (const c of e.kids) if (FAILED_TAGS.has(local(c.tag))) inc(errors, JSON.stringify([where, chain, efile, `(on the report) ${local(c.tag)}`, c.attrs.type ?? ""]));
    }
    const inner = [...walk(e)];
    const cases = inner.filter((c) => local(c.tag) === "testcase");
    const holders = inner.filter((s) => ["testsuite", "testsuites"].includes(local(s.tag)));
    for (const [kind, attr, want] of [["error", "errors", "errored"], ["failure", "failures", "failed"]] as const) {
      const n = count(e, attr);
      const explained = cases.filter((c) => caseOutcome(c) === want).length + holders.reduce((s, h) => s + h.kids.filter((c) => local(c.tag) === kind).length, 0);
      for (const [label, v] of [[`(declared ${attr})`, n], [`(declared ${attr} no case explains)`, Math.max(0, n - explained)]] as const) {
        if (v) inc(errors, JSON.stringify([where, chain, efile, label]), v);
      }
    }
    const marked = cases.filter((c) => c.kids.some((g) => local(g.tag) === "skipped") || NOT_RUN.has((c.attrs.status ?? "").toLowerCase()) || NOT_RUN.has((c.attrs.result ?? "").toLowerCase())).length;
    const skips = count(e, "skipped") + count(e, "disabled");
    if (skips > marked) die(`${f} declares ${skips} skipped but marks only ${marked} cases skipped, so which ran can't be told; the comparison is unverified`);
  }
}

export function showTest(t: string): string {
  const parts = JSON.parse(t) as [string, string[], ...string[]];
  return [parts[0], parts[1].join("/"), ...parts.slice(2)].filter(Boolean).join("::");
}
