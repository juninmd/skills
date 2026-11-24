import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const scripts = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "skills", "ci-speed", "scripts");
const stats = await import(pathToFileURL(path.join(scripts, "stats.mts")));
const cache = await import(pathToFileURL(path.join(scripts, "cachelog.mts")));
const cli = (...args) => spawnSync(process.execPath, [path.join(scripts, "measure.mts"), ...args], { encoding: "utf8" });

// Expected values come from the exact reference implementation this module was adapted from.
test("shiftInterval is the exact Mann-Whitney interval", () => {
  const s = stats.shiftInterval([10, 11, 12, 13, 14], [1, 2, 3, 4, 5]);
  assert.deepEqual([s.estimate, s.low, s.high], [-9, -12, -6]);
  const t = stats.shiftInterval([10, 11, 12, 13, 14, 15], [9, 10.5, 12, 13.5, 15, 16, 17]);
  assert.deepEqual([t.estimate, t.low, t.high], [1, -3, 4]);
});

test("a shift is unproven below the smallest sample that can show one", () => {
  const s = stats.shiftInterval([10, 11, 12], [1, 2, 3]);
  assert.equal(s.low, -Infinity);
  assert.equal(s.high, Infinity);
});

test("mannWhitneyCounts are the Gaussian binomial coefficients", () => {
  assert.deepEqual(stats.mannWhitneyCounts(3, 4, 6), [1n, 1n, 2n, 3n, 4n, 4n, 5n]);
});

test("failure-rate rise needs real evidence, and failsNeeded names the count", () => {
  assert.equal(stats.failsRose([0, 5], [7, 12]), true);
  assert.equal(stats.failsRose([0, 5], [6, 11]), false);
  assert.equal(stats.failsNeeded([0, 5], 5), 7);
  assert.equal(stats.failsNeeded([5, 5], 5), null);
});

test("tails compare like with like below 20 runs", () => {
  assert.deepEqual(stats.tails([1, 2, 3, 4, 5, 6, 7, 8], [10, 20, 30, 40, 50]), [["typical slowest of 5", 8], ["slowest run", 50]]);
});

test("fmt renders minutes and signs", () => {
  assert.deepEqual([stats.fmt(125), stats.fmt(-3), stats.fmt(null)], ["2m 05s", "-3.0s", "-"]);
});

test("flakebound matches the reference: 3 of 20 needs 92 runs", () => {
  const r = cli("flakebound", "--failures", "3", "--runs", "20");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /low end of its 95% interval 0\.0320709 \(rounded down\)/);
  assert.match(r.stdout, /at least 92 runs/);
  assert.equal(cli("flakebound", "--failures", "0", "--runs", "20").status, 1);
});

test("cachelog prints labels and hashed keys, never log text", () => {
  const log = [
    "2026-11-01T09:00:00.0000000Z Cache restored from key: pnpm-abc123",
    "2026-11-01T09:00:01.0000000Z pnpm cache is not found",
    "2026-11-01T09:00:02.0000000Z secret-token-value in a free-form line",
    "2026-11-01T09:00:03.0000000Z Cache hits 12",
  ].join("\n");
  const out = cache.cacheLines(log);
  assert.match(out[0], /^restore: hit key#[0-9a-f]{8}$/);
  assert.deepEqual(out.slice(1), ["restore: miss", "sccache cache hits: 12"]);
  assert.ok(!out.join("\n").includes("abc123"));
});

function junit(dir, name, body) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), `<?xml version="1.0"?><testsuites><testsuite name="a">${body}</testsuite></testsuites>`);
}

test("tests fails on a test that stopped running or newly fails, and passes when all are kept", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ci-speed-"));
  try {
    const all = '<testcase classname="m.A" name="t1"/><testcase classname="m.A" name="t2"/>';
    junit(path.join(tmp, "b", "shard-1"), "r.xml", all);
    junit(path.join(tmp, "same", "shard-2"), "r.xml", all);
    junit(path.join(tmp, "bad", "shard-1"), "r.xml", '<testcase classname="m.A" name="t1"/><testcase classname="m.A" name="t2"><failure>x</failure></testcase><testcase classname="m.A" name="t3"/>');
    junit(path.join(tmp, "gone", "shard-1"), "r.xml", '<testcase classname="m.A" name="t1"/><testcase classname="m.A" name="other"/>');
    const kept = cli("tests", "--before", path.join(tmp, "b"), "--after", path.join(tmp, "same"));
    assert.equal(kept.status, 0, kept.stdout + kept.stderr);
    assert.match(kept.stdout, /verdict: tests kept/);
    const failing = cli("tests", "--before", path.join(tmp, "b"), "--after", path.join(tmp, "bad"));
    assert.equal(failing.status, 1);
    assert.match(failing.stdout, /new failure: shard-#\/r::a::m\.A::t2/);
    const lost = cli("tests", "--before", path.join(tmp, "b"), "--after", path.join(tmp, "gone"));
    assert.equal(lost.status, 1);
    assert.match(lost.stdout, /stopped running: shard-#\/r::a::m\.A::t2/);
    assert.equal(cli("tests", "--before", path.join(tmp, "b"), "--after", path.join(tmp, "missing")).status, 2);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

function runs(start, count, seconds, jobConclusion = "success") {
  const iso = (t) => new Date(t * 1000).toISOString().replace(/\.\d+Z$/, "Z");
  return Array.from({ length: count }, (_, i) => {
    const t0 = start + i * 3600;
    const d = seconds + i * 3;
    return JSON.stringify({
      id: start + i, name: "CI", path: ".github/workflows/ci.yml", event: "pull_request", head_branch: `b${i}`, head_sha: `s${i}`,
      run_attempt: 1, head_repo: "o/n", conclusion: jobConclusion, created_at: iso(t0), run_started_at: iso(t0), updated_at: iso(t0 + d),
      pull_requests: [start + i], pull_request_bases: ["main"],
      jobs: [{ id: 1, name: "test", run_attempt: 1, conclusion: jobConclusion, created_at: iso(t0), started_at: iso(t0 + 5), completed_at: iso(t0 + d), labels: ["ubuntu-latest"], steps: [] }],
    });
  }).join("\n");
}

test("compare calls a clear speedup faster, and withholds timings below five runs a side", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ci-speed-"));
  try {
    const b = path.join(tmp, "b.jsonl");
    const a = path.join(tmp, "a.jsonl");
    fs.writeFileSync(b, `${runs(1_700_000_000, 12, 600)}\n`);
    fs.writeFileSync(a, `${runs(1_701_000_000, 12, 400)}\n`);
    const r = cli("compare", "--before", b, "--after", a, "--workflow", "CI", "--json");
    assert.equal(r.status, 0, r.stderr);
    const out = JSON.parse(r.stdout);
    assert.equal(out.verdict_code, "faster");
    assert.ok(out.shift_interval_95[1] < 0);
    fs.writeFileSync(b, `${runs(1_700_000_000, 4, 600)}\n`);
    fs.writeFileSync(a, `${runs(1_701_000_000, 4, 400)}\n`);
    const few = JSON.parse(cli("compare", "--before", b, "--after", a, "--json").stdout);
    assert.equal(few.verdict_code, "not_enough_runs");
    assert.equal(few.before_median, null);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("compare refuses a run on both sides and a floor below five", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ci-speed-"));
  try {
    const f = path.join(tmp, "x.jsonl");
    fs.writeFileSync(f, `${runs(1_700_000_000, 6, 600)}\n`);
    assert.equal(cli("compare", "--before", f, "--after", f).status, 2);
    const g = path.join(tmp, "y.jsonl");
    fs.writeFileSync(g, `${runs(1_701_000_000, 6, 400)}\n`);
    const r = cli("compare", "--before", f, "--after", g, "--min-runs", "3");
    assert.equal(r.status, 2);
    assert.match(r.stderr, /can't go below 5/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
