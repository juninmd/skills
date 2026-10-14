import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateSkill, EXCUSES_REQUIRED } from "./validate-agents.mjs";

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

## Preflight
${"`".repeat(3)}bash
ls
${"`".repeat(3)}

See [guide](references/guide.md).

## Workflow
1. Do it.

| Symptom | Action |
|---|---|
| a | b |

## Stop
- Halt when the state is wrong.

## Rules
- Keep it small.

## Checklist
- [ ] Validate the sample.
`;

test("accepts spec frontmatter and valid links", () => {
  const directory = createSkill(validSkill, { "references/guide.md": "# Guide\n" });
  assert.deepEqual(validateSkill(directory), []);
});

test("accepts the optional spec frontmatter fields", () => {
  const directory = createSkill(
    validSkill.replace(
      "---\n\n# Sample",
      'license: MIT\ncompatibility: Requires Node 18\nallowed-tools: [Read, Grep]\nmetadata:\n  owner: platform\n---\n\n# Sample',
    ),
    { "references/guide.md": "# Guide\n" },
  );
  assert.deepEqual(validateSkill(directory), []);
});

test("rejects frontmatter fields outside the spec", () => {
  const directory = createSkill(
    validSkill.replace("---\n\n# Sample", "version: 1.0.0\n---\n\n# Sample"),
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("unsupported")));
});

test("rejects angle brackets in the description", () => {
  const directory = createSkill(
    validSkill.replace(
      "local references.",
      "local references in <SKILL> blocks.",
    ),
    { "references/guide.md": "# Guide\n" },
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("angle brackets")));
});

test("rejects an over-long compatibility field", () => {
  const directory = createSkill(
    validSkill.replace("---\n\n# Sample", `compatibility: ${"x".repeat(501)}\n---\n\n# Sample`),
    { "references/guide.md": "# Guide\n" },
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("compatibility")));
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

test("rejects a description above the 1024-character spec limit", () => {
  const directory = createSkill(
    validSkill.replace(
      "Validate sample behavior and use this skill when testing skill metadata and local references.",
      `Validate sample behavior. ${"x".repeat(1024)}`,
    ),
    { "references/guide.md": "# Guide\n" },
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("1024-character")));
});

test("rejects names with the reserved words claude or anthropic", () => {
  const directory = createSkill(validSkill.replace("name: sample-skill", "name: claude-helper"));
  const errors = validateSkill(directory, "claude-helper");
  assert.ok(errors.some((error) => error.includes("reserved word")));
});

test("rejects metadata values that YAML reads as non-strings", () => {
  // Unquoted 1.10 parses as the number 1.1; the spec requires a string-to-string map.
  const directory = createSkill(
    validSkill.replace("---\n\n", "metadata:\n  version: 1.10\n---\n\n"),
    { "references/guide.md": "# Guide\n" },
  );
  assert.ok(validateSkill(directory).some((error) => error.includes("metadata.version must be a string")));
});

test("rejects orphan reference files", () => {
  const directory = createSkill(validSkill, {
    "references/guide.md": "# Guide\n",
    "references/unlinked.md": "# Nobody links here\n",
  });
  assert.ok(validateSkill(directory).some((error) => error.includes("orphan reference")));
});

test("accepts references mentioned via backticks in a topic map", () => {
  const directory = createSkill(
    validSkill.replace("See [guide]", "Map: [topics](references/TOPIC_MAP.md). See [guide]"),
    {
      "references/guide.md": "# Guide\n",
      "references/TOPIC_MAP.md": "# Topic map\n\nOpen `deep-dive.md` for details.\n",
      "references/deep-dive.md": "# Deep Dive\n",
    },
  );
  assert.deepEqual(validateSkill(directory), []);
});

test("rejects a reference reachable only through another reference", () => {
  // Agents preview nested files with partial reads; routing stays one hop from SKILL.md.
  const directory = createSkill(validSkill, {
    "references/guide.md": "# Guide\n\nSee `deep-dive.md` for details.\n",
    "references/deep-dive.md": "# Deep Dive\n",
  });
  assert.ok(validateSkill(directory).some((error) => error.includes("orphan reference 'references/deep-dive.md'")));
});

test("checks references inside vendored subfolders but not their UPSTREAM notes", () => {
  const routed = createSkill(validSkill.replace("See [guide]", "See [physics](references/vendor/physics.md) and [guide]"), {
    "references/guide.md": "# Guide\n",
    "references/vendor/physics.md": "# Physics\n",
    "references/vendor/UPSTREAM.md": "# Upstream\n",
  });
  assert.deepEqual(validateSkill(routed), []);

  const unrouted = createSkill(validSkill, {
    "references/guide.md": "# Guide\n",
    "references/vendor/physics.md": "# Physics\n",
  });
  assert.ok(validateSkill(unrouted).some((error) => error.includes("orphan reference 'references/vendor/physics.md'")));
});

test("requires a contents section in references over 100 lines", () => {
  const body = Array.from({ length: 101 }, (_, index) => `line ${index}`).join("\n");
  const without = createSkill(validSkill, { "references/guide.md": `# Guide\n\n${body}\n` });
  assert.ok(validateSkill(without).some((error) => error.includes("needs a '## Contents' section")));

  const withToc = createSkill(validSkill, {
    "references/guide.md": `# Guide\n\n## Contents\n\n- Usage\n\n## Usage\n\n${body}\n`,
  });
  assert.deepEqual(validateSkill(withToc), []);
});

test("requires a topic map for large reference collections", () => {
  const references = Object.fromEntries(
    Array.from({ length: 21 }, (_, index) => [`references/${index}.md`, "# Reference\n"]),
  );
  references["references/guide.md"] = "# Guide\n";
  const directory = createSkill(validSkill, references);
  assert.ok(validateSkill(directory).some((error) => error.includes("TOPIC_MAP")));
});

test("a body missing any house section is reported", () => {
  const FENCE = "`".repeat(3);
  const lines = [
    "---",
    "name: sample-skill",
    "description: |",
    "  Validate sample behavior and use this skill when testing skill structure.",
    "---",
    "",
    "# Sample",
    "",
    "## Preflight",
    `${FENCE}bash`,
    "ls",
    FENCE,
    "",
    "## Workflow",
    "1. Do it.",
    "",
    "| Symptom | Action |",
    "|---|---|",
    "| a | b |",
    "",
    "## Stop",
    "- Halt when the state is wrong.",
    "",
    "## Rules",
    "- Keep it small.",
    "",
    "## Checklist",
    "- [ ] done.",
    "",
  ];
  const build = (drop = []) =>
    createSkill(lines.filter((l) => !drop.includes(l)).join("\n"));

  assert.deepEqual(validateSkill(build()), []);
  assert.ok(
    validateSkill(build(["## Preflight"])).some((e) => e.includes("'## Preflight'")),
  );
  assert.ok(validateSkill(build(["## Stop"])).some((e) => e.includes("'## Stop'")));
  assert.ok(validateSkill(build(["## Workflow"])).some((e) => e.includes("'## Workflow'")));
  assert.ok(validateSkill(build(["## Rules"])).some((e) => e.includes("'## Rules'")));
  assert.ok(
    validateSkill(build(["## Checklist"])).some((e) => e.includes("'## Checklist'")),
  );
  assert.ok(
    validateSkill(build([`${FENCE}bash`, FENCE])).some((e) => e.includes("a command block")),
  );
  assert.ok(
    validateSkill(build(["| Symptom | Action |", "|---|---|", "| a | b |"])).some((e) =>
      e.includes("a decision table"),
    ),
  );
});

test("a high-risk skill without an Excuses table fails", () => {
  const name = [...EXCUSES_REQUIRED][0];
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-validator-"));
  const directory = path.join(root, name);
  fs.mkdirSync(directory);
  const body = validSkill
    .replace("name: sample-skill", `name: ${name}`)
    .replace("See [guide](references/guide.md).\n\n", "");

  fs.writeFileSync(path.join(directory, "SKILL.md"), body);
  assert.deepEqual(validateSkill(directory), [
    `${name}: body is missing '## Excuses' — the table of excuses for skipping a step, and why each is false`,
  ]);

  const withExcuses = body.replace(
    "## Checklist",
    "## Excuses\n\n| Excuse | Why it is false |\n|---|---|\n| \"later\" | later never arrives |\n\n## Checklist",
  );
  fs.writeFileSync(path.join(directory, "SKILL.md"), withExcuses);
  assert.deepEqual(validateSkill(directory), []);
});
