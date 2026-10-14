import assert from "node:assert/strict";
import test from "node:test";
import { checkDependencyAge, parseLockfile, MAX_RESPONSE } from "./check-dependency-age.mjs";

const lock = (key = "pkg@1.0.0", integrity = "sha512-QUJD") => `lockfileVersion: '9.0'\npackages:\n  '${key}':\n    resolution:\n      integrity: ${integrity}\n`;
const fakeFetch = (timestamp, bodySize = 100, status = 200) => async () => ({ ok: status === 200, status, body: { getReader() { let done = false; return { async read() { if (done) return { done: true }; done = true; return { done: false, value: new TextEncoder().encode(JSON.stringify({ time: { "1.0.0": timestamp }, versions: { "1.0.0": { dist: { integrity: "sha512-QUJD" } } } }).padEnd(bodySize, " ")) }; }, async cancel() {} }; } } });

test("accepts the exact 1440 minute boundary", async () => {
  const now = Date.parse("2026-01-02T00:00:00Z");
  assert.equal((await checkDependencyAge(lock(), { now: () => now, fetchImpl: fakeFetch("2026-01-01T00:00:00.000Z") })).ok, true);
});
test("rejects young, future, missing timestamp, nonregistry, and oversize records", async () => {
  const now = Date.parse("2026-01-02T00:00:00Z");
  for (const timestamp of ["2026-01-01T12:00:00.000Z", "2027-01-01T00:00:00.000Z", "2025-02-30T00:00:00.000Z", undefined]) {
    const result = await checkDependencyAge(lock(), { now: () => now, fetchImpl: fakeFetch(timestamp) }); assert.equal(result.ok, false);
  }
  assert.throws(() => parseLockfile(lock("pkg@npm:other@1.0.0")), /unsupported|invalid/);
  assert.throws(() => parseLockfile(lock("pkg@1.0.0", "sha512-x".repeat(2))), /invalid integrity/);
});
test("deduplicates peer-context records by package and version", () => {
  const records = parseLockfile(`${lock("pkg@1.0.0")}\n  'pkg@1.0.0(peer@2.0.0)':\n    resolution: {integrity: sha512-QUJD}\n`);
  assert.equal(records.length, 1); assert.equal(records[0].lockKeys.length, 2);
  assert.throws(() => parseLockfile(`${lock()}\n  'pkg@1.0.0(peer@2.0.0)':\n    resolution: {integrity: sha512-VEFNUEVS}\n`), /conflicting locked integrity/);
});

test("fails closed on oversized and failed registry responses", async () => {
  const now = Date.parse("2026-01-02T00:00:00Z");
  assert.equal((await checkDependencyAge(lock(), { now: () => now, fetchImpl: fakeFetch("2026-01-01T00:00:00.000Z", MAX_RESPONSE + 1) })).ok, false);
  assert.equal((await checkDependencyAge(lock(), { now: () => now, fetchImpl: fakeFetch("2026-01-01T00:00:00.000Z", 100, 503) })).ok, false);
});

test("preserves stricter configured cooldown and rejects invalid controls", async () => {
  const options = { now: () => Date.parse("2026-01-03T00:00:00Z"), fetchImpl: fakeFetch("2026-01-01T00:00:00.000Z") };
  assert.equal((await checkDependencyAge(lock(), { ...options, workspaceText: "minimumReleaseAge: 10080 # seven days" })).ok, false);
  for (const value of [0, -1, 1.5, "false", "unknown"]) {
    await assert.rejects(checkDependencyAge(lock(), { ...options, workspaceText: `minimumReleaseAge: ${value}` }), /1440/);
  }
});

test("fails a young transitive version even when the direct version is mature", async () => {
  const tree = `${lock()}\n  transitive@2.0.0:\n    resolution: {integrity: sha512-QUJD}\n`;
  const fetchImpl = async (url) => new Response(JSON.stringify(url.endsWith("/pkg")
    ? { time: { "1.0.0": "2026-01-01T00:00:00.000Z" }, versions: { "1.0.0": { dist: { integrity: "sha512-QUJD" } } } }
    : { time: { "2.0.0": "2026-01-02T12:00:00.000Z" }, versions: { "2.0.0": { dist: { integrity: "sha512-QUJD" } } } }));
  const result = await checkDependencyAge(tree, { now: () => Date.parse("2026-01-03T00:00:00Z"), fetchImpl });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].package, "transitive@2.0.0");
  assert.match(result.errors[0].reason, /younger/);
});

test("missing or tampered registry version integrity cannot pass", async () => {
  const options = { now: () => Date.parse("2026-01-03T00:00:00Z"), fetchImpl: fakeFetch("2026-01-01T00:00:00.000Z") };
  assert.equal((await checkDependencyAge(lock("pkg@1.0.0", "sha512-VEFNUEVS"), options)).ok, false);
  assert.equal((await checkDependencyAge(lock("pkg@2.0.0"), options)).ok, false);
});

test("untrusted registry failures never echo response data or credentials", async () => {
  const result = await checkDependencyAge(lock(), { fetchImpl: async () => { throw new Error("secret=credential malicious instructions"); } });
  assert.equal(result.ok, false);
  assert.doesNotMatch(JSON.stringify(result), /credential|instructions/);
  assert.throws(() => parseLockfile(lock("https://user:credential@evil.test@1.0.0")), (error) => !error.message.includes("credential"));
});
