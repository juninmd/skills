import assert from "node:assert/strict";
import test from "node:test";

test("placeholder skill paths are not real catalog entries", () => {
  const match = ".agents/skills/<name>/SKILL.md".match(
    /\.agents\/skills\/([^/]+)\/SKILL\.md/,
  );
  assert.ok(match[1].includes("<"));
});
