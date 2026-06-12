import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  CATALOG_END,
  CATALOG_START,
  renderCatalog,
  replaceCatalog,
  writeCatalog,
} from "./catalog.mjs";
import { checkCatalog } from "./check-catalog.mjs";

const skills = [
  {
    name: "sample-skill",
    metadata: {
      description: "Validate sample behavior. Use for metadata and catalog tests.",
    },
  },
];

test("renders a deterministic catalog from descriptions", () => {
  assert.match(renderCatalog(skills), /\| `sample-skill` \| metadata and catalog tests \|/);
});

test("replaces only the marked catalog block", () => {
  const readme = `Before\n${CATALOG_START}\nstale\n${CATALOG_END}\nAfter\n`;
  const result = replaceCatalog(readme, renderCatalog(skills));
  assert.match(result, /^Before/);
  assert.match(result, /sample-skill/);
  assert.match(result, /After\n$/);
});

test("rejects README files without catalog markers", () => {
  assert.throws(() => replaceCatalog("# README\n", renderCatalog(skills)), /markers/);
});

test("detects and repairs catalog drift end to end", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-catalog-"));
  const skillDirectory = path.join(root, ".agents", "skills", "sample-skill");
  fs.mkdirSync(skillDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(skillDirectory, "SKILL.md"),
    `---
name: sample-skill
description: Validate sample behavior. Use for metadata and catalog tests.
---

## Checklist
- [ ] Validate.
`,
  );
  fs.writeFileSync(
    path.join(root, "README.md"),
    `1 skills\n${CATALOG_START}\nstale\n${CATALOG_END}\n`,
  );

  assert.ok(checkCatalog(root).some((error) => error.includes("stale")));
  writeCatalog(root);
  assert.deepEqual(checkCatalog(root), []);
});
