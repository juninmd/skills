import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { shellFenceErrors, shellFences } from "./shell-fences.mjs";

const roots = [];
after(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

// A skill directory whose files are the given relative paths and contents.
function skillWith(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "shell-fences-"));
  roots.push(root);
  const dir = path.join(root, "sample-skill");
  for (const [relative, text] of Object.entries(files)) {
    const file = path.join(dir, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return dir;
}

test("shell fences are extracted with their start line and language", () => {
  const fences = shellFences("text\n\n```bash\necho ok\n```\n\n```json\n{}\n```\n");
  assert.deepEqual(fences, [{ line: 3, code: "echo ok" }]);
});

test("CRLF checkouts yield the same code as LF", () => {
  const crlf = "```bash\r\nif true; then\r\n  echo ok\r\nfi\r\n```\r\n";
  assert.deepEqual(shellFences(crlf), [{ line: 1, code: "if true; then\n  echo ok\nfi" }]);
  assert.deepEqual(shellFenceErrors(skillWith({ "SKILL.md": crlf })), []);
});

test("an info string with attributes still names the shell", () => {
  assert.deepEqual(shellFences('```bash title="x"\necho ok\n```\n'), [{ line: 1, code: "echo ok" }]);
});

test("a longer outer fence keeps inner blocks as text", () => {
  assert.deepEqual(shellFences("````markdown\n```bash\nif true; then\n````\n"), []);
});

test("an unclosed shell fence at end of file is still checked", () => {
  assert.deepEqual(shellFences("```bash\necho ok\n"), [{ line: 1, code: "echo ok" }]);
});

test("a block that parses passes; one that does not reports its file and line", () => {
  const dir = skillWith({ "references/run.md": "# Run\n\n```bash\nif true; then\n```\n" });
  const errors = shellFenceErrors(dir);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /sample-skill: references\/run\.md:3 shell block does not parse/);
  assert.deepEqual(shellFenceErrors(skillWith({ "SKILL.md": "```bash\necho ok\n```\n" })), []);
});

test("a placeholder block is an illustration and is skipped", () => {
  const dir = skillWith({ "references/run.md": "```bash\ngit clone <repo-url>\n```\n" });
  assert.deepEqual(shellFenceErrors(dir), []);
});

test("a file redirect is not a placeholder, so the block is still checked", () => {
  const dir = skillWith({ "references/run.md": "```bash\nsort <names.txt >sorted.txt\nif true; then\n```\n" });
  assert.equal(shellFenceErrors(dir).length, 1);
});

test("a non-shell fence is not checked", () => {
  assert.deepEqual(shellFenceErrors(skillWith({ "references/run.md": "```text\nif true\n```\n" })), []);
});
