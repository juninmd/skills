import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateSkill } from "./validate-agents.mjs";

function createSkill(contents, references = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-validator-"));
  const skillDirectory = path.join(root, "sample-skill");
  fs.mkdirSync(skillDirectory);
  fs.writeFileSync(path.join(skillDirectory, "SKILL.md"), contents);
  for (const [relativePath, value] of Object.entries(references)) {
    const filePath = path.join(skillDirectory, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value);
  }
  return skillDirectory;
}

const validSkill = `---
name: sample-skill
description: |
  Validate sample behavior and use this skill when testing skill metadata and local references.
---

# Sample

See [guide](references/guide.md).

## Checklist
- [ ] Validate the sample.
`;

test("accepts spec frontmatter and valid links", () => {
  const directory = createSkill(validSkill, { "references/guide.md": "# Guide\n" });
  assert.deepEqual(validateSkill(directory), []);
});

test("rejects unsupported frontmatter fields", () => {
  const directory = createSkill(
    validSkill.replace("---\n\n# Sample", "license: MIT\n---\n\n# Sample"),
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("unsupported")));
});

test("rejects an uninformative description", () => {
  const directory = createSkill(
    validSkill.replace(
      "Validate sample behavior and use this skill when testing skill metadata and local references.",
      "Validate files.",
    ),
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("description")));
});

test("rejects a missing checklist", () => {
  const directory = createSkill(
    validSkill.replace("\n## Checklist\n- [ ] Validate the sample.\n", "\n"),
    { "references/guide.md": "# Guide\n" },
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("Checklist")));
});

test("rejects broken local links", () => {
  const directory = createSkill(validSkill);
  assert.ok(validateSkill(directory).some((error) => error.includes("broken local link")));
});

test("rejects malformed YAML and duplicate fields", () => {
  const malformed = createSkill(validSkill.replace("description: |", "description: ["));
  assert.ok(validateSkill(malformed).some((error) => error.includes("invalid YAML")));

  const duplicate = createSkill(
    validSkill.replace("description: |", "name: duplicate\n description: |"),
  );
  assert.ok(validateSkill(duplicate).some((error) => error.includes("invalid YAML")));
});

test("requires a topic map for large reference collections", () => {
  const references = Object.fromEntries(
    Array.from({ length: 21 }, (_, index) => [`references/${index}.md`, "# Reference\n"]),
  );
  references["references/guide.md"] = "# Guide\n";
  const directory = createSkill(validSkill, references);
  assert.ok(validateSkill(directory).some((error) => error.includes("TOPIC_MAP")));
});
