import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { walkFiles } from "./walk-files.mjs";

function createTree(entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "walk-files-"));
  for (const [relativePath, contents] of Object.entries(entries)) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  return root;
}

// File symlinks need Developer Mode or an elevated shell on Windows (the
// installer works around the same limit with junctions for directories).
// Skip rather than fail when this sandbox cannot create one.
function trySymlink(t, targetPath, linkPath) {
  try {
    fs.symlinkSync(targetPath, linkPath);
    return true;
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      t.skip(`cannot create symlinks in this sandbox (${error.code})`);
      return false;
    }
    throw error;
  }
}

test("walks nested directories and returns sorted absolute file paths", () => {
  const root = createTree({ "b.md": "b", "a/c.md": "c", "a/a.md": "a" });
  const files = walkFiles(["."], { cwd: root });
  assert.deepEqual(
    files.map((file) => path.relative(root, file).split(path.sep).join("/")),
    ["a/a.md", "a/c.md", "b.md"],
  );
});

test("a filter keeps only matching files while still traversing every directory", () => {
  const root = createTree({ "docs/a.md": "a", "docs/a.txt": "a", "src/b.md": "b" });
  const files = walkFiles(["docs", "src"], { cwd: root, filter: (file) => file.endsWith(".md") });
  assert.equal(files.length, 2);
  assert.ok(files.every((file) => file.endsWith(".md")));
});

test("skip prunes an entry by name whether it is a file or a directory", () => {
  const root = createTree({
    "keep.md": "k",
    "node_modules/pkg/readme.md": "r",
    ".git/config": "c",
  });
  const files = walkFiles(["."], { cwd: root, skip: ["node_modules", ".git"] });
  assert.deepEqual(files.map((file) => path.basename(file)), ["keep.md"]);
});

test("symlinks default to skip: a symlinked file is silently omitted", (t) => {
  const root = createTree({ "real.md": "r" });
  if (!trySymlink(t, path.join(root, "real.md"), path.join(root, "link.md"))) return;
  const files = walkFiles(["."], { cwd: root });
  assert.deepEqual(files.map((file) => path.basename(file)), ["real.md"]);
});

test("symlinks: 'throw' fails loudly the moment one is found", (t) => {
  const root = createTree({ "real.md": "r" });
  if (!trySymlink(t, path.join(root, "real.md"), path.join(root, "link.md"))) return;
  assert.throws(() => walkFiles(["."], { cwd: root, symlinks: "throw" }), /Symlinks are not allowed/);
});

test("symlinks: 'follow' stats through a symlinked file", (t) => {
  const root = createTree({ "real.md": "r" });
  if (!trySymlink(t, path.join(root, "real.md"), path.join(root, "link.md"))) return;
  const files = walkFiles(["."], { cwd: root, symlinks: "follow" }).map((file) => path.basename(file));
  assert.deepEqual(files.sort(), ["link.md", "real.md"]);
});

test("maxDepth stops descending past the cap", () => {
  const root = createTree({ "a/b/c/d/deep.md": "d", "shallow.md": "s" });
  const files = walkFiles(["."], { cwd: root, maxDepth: 1 }).map((file) => path.relative(root, file));
  assert.deepEqual(files.sort(), ["shallow.md"]);
});

test("tolerant swallows a broken symlink instead of throwing", (t) => {
  const root = createTree({ "keep.md": "k" });
  if (!trySymlink(t, path.join(root, "missing-target"), path.join(root, "broken.md"))) return;
  const files = walkFiles(["."], { cwd: root, symlinks: "follow", tolerant: true });
  assert.deepEqual(files.map((file) => path.basename(file)), ["keep.md"]);
});

test("a root may itself be a file, and a missing root is skipped rather than throwing", () => {
  const root = createTree({ "a.md": "a" });
  const files = walkFiles(["a.md", "does-not-exist"], { cwd: root });
  assert.equal(files.length, 1);
});
