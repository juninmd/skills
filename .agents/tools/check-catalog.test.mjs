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

test("rejects a catalog over the skill ceiling", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-ceiling-"));
  for (const name of ["one-skill", "two-skill"]) {
    const directory = path.join(root, ".agents", "skills", name);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "SKILL.md"),
      `---
name: ${name}
description: Validate ${name}. Use for ceiling tests.
---
`,
    );
  }
  fs.writeFileSync(path.join(root, "README.md"), `2 skills
${CATALOG_START}
${CATALOG_END}
`);

  assert.ok(checkCatalog(root, 1).some((error) => error.includes("1-skill ceiling")));
  assert.ok(!checkCatalog(root, 2).some((error) => error.includes("ceiling")));
});

test("keeps trigger phrases out of the catalog summary", () => {
  const withTriggers = [{
    name: "sample-skill",
    metadata: { description: "Validate sample behavior. Use for metadata and catalog tests. Trigger on 'check the catalog', 'is it stale'." },
  }];
  assert.match(renderCatalog(withTriggers), /\| `sample-skill` \| metadata and catalog tests \|/);
});
