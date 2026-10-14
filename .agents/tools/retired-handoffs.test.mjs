import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { findRetiredHandoffs, checkRetiredHandoffs } from "./retired-handoffs.mjs";

const migrations = { "old-skill": "current-skill" };

test("rejects retired prose and backtick handoffs with line numbers", () => {
  assert.deepEqual(findRetiredHandoffs("# Guide\nDelegate to old-skill.\nUse `old-skill`.", migrations), [
    { name: "old-skill", owner: "current-skill", line: 2 },
    { name: "old-skill", owner: "current-skill", line: 3 },
  ]);
});

test("permits explicit procedure links and filenames after consolidation", () => {
  const text = "Read [old-skill](references/old-skill.md), then `references/old-skill.md`.\nUse `current-skill`.";
  assert.deepEqual(findRetiredHandoffs(text, migrations), []);
});

test("checks copied invocation examples without flagging unrelated code or URLs", () => {
  const text = "```text\n/old-skill\n$old-skill\n```\n```js\nconst example = 'old-skill';\n```\nhttps://example.com/old-skill";
  assert.deepEqual(findRetiredHandoffs(text, migrations).map(({ line }) => line), [2, 3]);
});

test("detects retired calls in nested references and missing migration owners", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "retired-handoffs-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "skills/current-skill/references"), { recursive: true });
  fs.writeFileSync(path.join(root, "retired-skills.json"), JSON.stringify(migrations));
  fs.writeFileSync(path.join(root, "skills/current-skill/SKILL.md"), "# Current");
  fs.writeFileSync(path.join(root, "skills/current-skill/references/guide.md"), "Call old-skill.");
  assert.match(checkRetiredHandoffs(root).join("\n"), /guide.md:1.*old-skill.*current-skill/);
  fs.writeFileSync(path.join(root, "retired-skills.json"), JSON.stringify({ "old-skill": "missing" }));
  assert.match(checkRetiredHandoffs(root).join("\n"), /missing owner/);
});

test("rejects a migration whose procedure file lives under another skill", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "retired-owner-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const skill of ["current-skill", "other-skill"]) {
    fs.mkdirSync(path.join(root, "skills", skill, "references"), { recursive: true });
    fs.writeFileSync(path.join(root, "skills", skill, "SKILL.md"), "# Skill");
  }
  fs.writeFileSync(path.join(root, "retired-skills.json"), JSON.stringify(migrations));
  fs.writeFileSync(path.join(root, "skills/other-skill/references/old-skill.md"), "# Moved procedure");
  assert.match(checkRetiredHandoffs(root).join("\n"), /'old-skill'.*other-skill/);
  fs.renameSync(
    path.join(root, "skills/other-skill/references/old-skill.md"),
    path.join(root, "skills/current-skill/references/old-skill.md"),
  );
  assert.deepEqual(checkRetiredHandoffs(root), []);
});
