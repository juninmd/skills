import assert from "node:assert/strict";
import test from "node:test";
import { signature, summarize } from "../skills/observability/scripts/signatures.mjs";

const re = /error|fail|crash/i;

test("one defect collapses to one signature across timestamps, ids, and counts", () => {
  const a = "2026-10-21T10:00:01Z ERROR worker 4182 failed job 9f8e7d6c5b4a: timeout after 30s";
  const b = "2026-10-21T10:07:55Z ERROR worker 977 failed job 1a2b3c4d5e6f: timeout after 45s";
  assert.equal(signature(a), signature(b));
});

test("a leading timestamp is dropped so ledger keys stay readable and stable", () => {
  assert.equal(signature("2026-10-21T10:00:01Z ERROR db failed 12"), "ERROR db failed <n>");
});

test("different defects keep different signatures", () => {
  assert.notEqual(signature("ERROR cannot open config.yaml"), signature("ERROR connection refused"));
});

test("lines that are not errors are ignored", () => {
  const rows = summarize(["INFO started", "DEBUG tick 3"], {}, re);
  assert.equal(rows.length, 0);
});

test("a signature already in the ledger is KNOWN-status, new ones sort first", () => {
  const known = { [signature("ERROR db failed 12")]: { status: "fixed" } };
  const rows = summarize(["ERROR db failed 99", "ERROR db failed 7", "crash in plugin 3"], known, re);
  assert.equal(rows[0].status, "NEW");
  assert.equal(rows[1].status, "fixed");
  assert.equal(rows[1].count, 2);
});
