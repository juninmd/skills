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

test("links inside fenced or inline code are examples, not links (lychee skips them too)", () => {
  const root = createTree({
    "docs/index.md": "```md\nSee [example](not-here.md)\n```\n\n~~~\n[x](gone.md)\n~~~\n\nUse `[y](nope.md)` syntax.",
  });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)), []);
});

test("a link with a title is still checked", () => {
  const root = createTree({ "docs/index.md": 'See [gone](missing.md "Title").' });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)).map((b) => b.target), ["missing.md"]);
});

test("a malformed percent escape is reported instead of crashing the run", () => {
  const root = createTree({ "docs/index.md": "See [rate](100%.md)." });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)).map((b) => b.target), ["100%.md"]);
});

test("an unpaired backtick does not hide a broken link in the next paragraph", () => {
  const root = createTree({
    "docs/index.md": "Use the ` flag, then read [guide](missing-guide.md).\n\nLater we set `x` here.",
  });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)).map((b) => b.target), ["missing-guide.md"]);
});

test("a code span that wraps onto the next line is still skipped", () => {
  const root = createTree({ "docs/index.md": "Use `[y](nope.md)\nand more` syntax." });
  assert.deepEqual(findBrokenLinks(collectMarkdown(["docs"], root)), []);
});
