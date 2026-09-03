import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateSkill, checkSiblingHandoffs, EXCUSES_REQUIRED } from "./validate-agents.mjs";

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

test("rejects orphan reference files", () => {
  const directory = createSkill(validSkill, {
    "references/guide.md": "# Guide\n",
    "references/unlinked.md": "# Nobody links here\n",
  });
  assert.ok(validateSkill(directory).some((error) => error.includes("orphan reference")));
});

test("accepts references mentioned via backticks in a topic map", () => {
  const directory = createSkill(validSkill, {
    "references/guide.md": "# Guide\n\nSee `deep-dive.md` for details.\n",
    "references/deep-dive.md": "# Deep Dive\n",
  });
  assert.deepEqual(validateSkill(directory), []);
});

test("requires a topic map for large reference collections", () => {
  const references = Object.fromEntries(
    Array.from({ length: 21 }, (_, index) => [`references/${index}.md`, "# Reference\n"]),
  );
  references["references/guide.md"] = "# Guide\n";
  const directory = createSkill(validSkill, references);
  assert.ok(validateSkill(directory).some((error) => error.includes("TOPIC_MAP")));
});

test("a skill naming no sibling is reported", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-siblings-"));
  const write = (name, body) => {
    fs.mkdirSync(path.join(root, name));
    fs.writeFileSync(path.join(root, name, "SKILL.md"), body);
  };
  const frontmatter = (name) =>
    `---\nname: ${name}\ndescription: |\n  Do the ${name} job and use this skill when that job comes up.\n---\n\n# ${name}\n\n## Checklist\n- [ ] done.\n`;
  write("alpha-skill", frontmatter("alpha-skill").replace("## Checklist", "Hand off to `beta-skill`.\n\n## Checklist"));
  write("beta-skill", frontmatter("beta-skill"));

  const errors = checkSiblingHandoffs(root);
  assert.deepEqual(errors, [
    "beta-skill: body names no sibling skill to hand work to",
    "alpha-skill: no sibling skill hands work to it — cite it from the skill that would otherwise absorb its job",
  ]);
});

test("a skill no sibling hands work to is reported as an island", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-islands-"));
  const write = (name, handoff) => {
    fs.mkdirSync(path.join(root, name));
    fs.writeFileSync(
      path.join(root, name, "SKILL.md"),
      `---\nname: ${name}\ndescription: |\n  Do the ${name} job and use this skill when that job comes up.\n---\n\nHand off to \`${handoff}\`.\n\n## Checklist\n- [ ] done.\n`,
    );
  };
  write("alpha-skill", "beta-skill");
  write("beta-skill", "alpha-skill");
  write("gamma-skill", "alpha-skill");

  assert.deepEqual(checkSiblingHandoffs(root), [
    "gamma-skill: no sibling skill hands work to it — cite it from the skill that would otherwise absorb its job",
  ]);
});

test("a skill citing only itself does not count as a handoff", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-siblings-self-"));
  fs.mkdirSync(path.join(root, "lonely-skill"));
  fs.writeFileSync(
    path.join(root, "lonely-skill", "SKILL.md"),
    "---\nname: lonely-skill\ndescription: |\n  Be lonely and use this skill when nobody else will.\n---\n\nRun `lonely-skill` again.\n\n## Checklist\n- [ ] done.\n",
  );
  assert.deepEqual(checkSiblingHandoffs(root), [
    "lonely-skill: body names no sibling skill to hand work to",
    "lonely-skill: no sibling skill hands work to it — cite it from the skill that would otherwise absorb its job",
  ]);
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
