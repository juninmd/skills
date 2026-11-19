import assert from "node:assert/strict";
import test from "node:test";
import { checkPrEvidence } from "./check-pr-evidence.mjs";

const wrap = (e) => `## Summary\n- x\n\n## Evidence\n${e}\n\n## How to test\n- y\n`;

test("rejects body without Evidence section", () => {
  assert.equal(checkPrEvidence("## Summary\n- x").length, 1);
});

test("rejects untouched template (only comments)", () => {
  assert.ok(checkPrEvidence(wrap("<!-- Required -->")).length > 0);
});

test("rejects prose-only evidence", () => {
  assert.ok(checkPrEvidence(wrap("Tests pass, trust me, everything was verified locally.")).length > 0);
});

test("rejects local paths and raw branch URLs", () => {
  assert.ok(checkPrEvidence(wrap("![a](/tmp/shot.png)\n![b](https://raw.githubusercontent.com/o/r/b/a.png)")).length > 0);
});

test("accepts uploaded screenshot with context", () => {
  const e = "Surface: web, /home, 1280px\n![After](https://github.com/user-attachments/assets/1234-abcd)";
  assert.deepEqual(checkPrEvidence(wrap(e)), []);
});

test("accepts fenced CLI output", () => {
  assert.deepEqual(checkPrEvidence(wrap("```console\n$ pnpm run validate\nok\n```")), []);
});

test("accepts CI run link", () => {
  assert.deepEqual(
    checkPrEvidence(wrap("Gates green: https://github.com/juninmd/skills/actions/runs/123 (refactor, no behavior change)")),
    [],
  );
});

test("stops at next heading", () => {
  const body = "## Evidence\n\n## How to test\n```console\nx\n```";
  assert.ok(checkPrEvidence(body).length > 0);
});
