import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { collectMarkdown, findBrokenLinks } from "./check-links.mjs";

function createTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "link-check-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  return root;
}

test("a resolvable relative link passes", () => {
  const root = createTree({
    "docs/index.md": "See [guide](guide.md) and [deep](nested/deep.md).",
    "docs/guide.md": "# Guide",
    "docs/nested/deep.md": "# Deep",
  });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)), []);
});

test("a missing target is reported", () => {
  const root = createTree({ "docs/index.md": "See [gone](missing.md)." });
  const broken = findBrokenLinks(collectMarkdown(["docs"], root));
  assert.equal(broken.length, 1);
  assert.equal(broken[0].target, "missing.md");
});

test("external, mailto, and anchor links are left to CI", () => {
  const root = createTree({
    "docs/index.md":
      "[web](https://example.com/x) [mail](mailto:a@b.c) [here](#section) [rel](guide.md#part)",
    "docs/guide.md": "# Guide",
  });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)), []);
});

test("a link without the .md suffix resolves, as it does under lychee", () => {
  const root = createTree({
    "docs/index.md": "See [guide](guide).",
    "docs/guide.md": "# Guide",
  });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)), []);
});

test("build output directories are not walked", () => {
  const root = createTree({
    "docs/index.md": "# Index",
    "docs/node_modules/pkg/readme.md": "[broken](nope.md)",
    "docs/.vitepress/dist/x.md": "[broken](nope.md)",
  });
  const files = collectMarkdown(["docs"], root);
  assert.equal(files.length, 1);
  assert.deepEqual(findBrokenLinks(files), []);
});
