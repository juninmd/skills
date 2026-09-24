import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSkill, listSkillDirectoryNames } from "./skill-metadata.mjs";
import { checkRetiredHandoffs } from "./retired-handoffs.mjs";
import { walkFiles } from "./walk-files.mjs";

// A body long enough to skim past is a body an agent will skim past. The
// ceiling is a ratchet: raise it deliberately, never to fit one more paragraph.
// Moved 1000 -> 1800 alongside the tier-2 token ceiling.
export const WORD_BUDGET = 1800;

// The Agent Skills spec allows six top-level keys. Restricting the catalog to
// name/description is a house style, not the spec, and it rejected valid skills
// imported from other catalogs. Accept the full set and validate each one.
const ALLOWED_FIELDS = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "compatibility",
]);

// Skills where the failure mode is the agent talking itself out of a step it
// knows about — skipping the failing test, deleting on a clean grep, merging
// past an open comment. For those, an `## Excuses` table (excuse -> why it is
// false) is worth more than another rule, because the rule was never the part
// that was missing. Opt-in by name: the block is dead weight in a skill whose
// steps nobody is tempted to skip.
export const EXCUSES_REQUIRED = new Set([
  "code-review",
  "finishing-dev",
  "git-workflow",
  "security-ops",
  "test-engineering",
]);

export function validateSkill(skillDirectory) {
  const errors = [];
  const skillName = path.basename(skillDirectory);
  const skillFile = path.join(skillDirectory, "SKILL.md");

  if (!fs.existsSync(skillFile)) return [`${skillName}: missing SKILL.md`];

  let skill;
  try {
    skill = readSkill(skillDirectory);
  } catch (error) {
    return [error.message];
  }

  const { metadata, text } = skill;
  const declaredName = metadata.name;
  if (declaredName !== skillName) {
    errors.push(`${skillName}: frontmatter name must equal the folder name`);
  }

  if (!/^[a-z0-9-]{1,64}$/.test(skillName)) {
    errors.push(`${skillName}: name must be lowercase hyphen-case and at most 64 characters`);
  } else if (skillName.startsWith("-") || skillName.endsWith("-") || skillName.includes("--")) {
    errors.push(
      `${skillName}: name cannot start or end with a hyphen or contain consecutive hyphens`,
    );
  }
  if (/claude|anthropic/.test(String(declaredName))) {
    errors.push(`${skillName}: name must not contain the reserved word 'claude' or 'anthropic'`);
  }

  const extra = metadata.metadata;
  if (extra !== undefined) {
    if (!extra || typeof extra !== "object" || Array.isArray(extra)) {
      errors.push(`${skillName}: metadata must be a map of string keys to string values`);
    } else {
      for (const [key, value] of Object.entries(extra)) {
        if (typeof value !== "string") {
          errors.push(`${skillName}: metadata.${key} must be a string; quote it`);
        }
      }
    }
  }

  for (const field of Object.keys(metadata)) {
    if (!ALLOWED_FIELDS.has(field)) {
      errors.push(`${skillName}: unsupported frontmatter field '${field}'`);
    }
  }

  const description =
    typeof metadata.description === "string" ? metadata.description.trim() : "";
  if (description.length < 40) {
    errors.push(`${skillName}: description must explain what the skill does and when to use it`);
  }
  if (description.length > 1024) {
    errors.push(`${skillName}: description exceeds the 1024-character spec limit`);
  }
  // Angle brackets can terminate the tags that wrap the catalog in a system
  // prompt, so the spec forbids them outright.
  if (/[<>]/.test(description)) {
    errors.push(`${skillName}: description must not contain angle brackets`);
  }

  const compatibility = metadata.compatibility;
  if (compatibility !== undefined) {
    if (typeof compatibility !== "string") {
      errors.push(`${skillName}: compatibility must be a string`);
    } else if (compatibility.length > 500) {
      errors.push(`${skillName}: compatibility exceeds the 500-character spec limit`);
    }
  }

  const allowedTools = metadata["allowed-tools"];
  if (allowedTools !== undefined && !Array.isArray(allowedTools) && typeof allowedTools !== "string") {
    errors.push(`${skillName}: allowed-tools must be a string or a list of tool names`);
  }

  // The house structure. Each of these is the difference between a procedure an
  // agent can execute and advice it already knows: state established before
  // acting, a lookup instead of a paragraph, the real invocation instead of a
  // description of one, the conditions that halt the work, and a verifiable end.
  for (const [pattern, missing] of [
    [/^## Preflight\s*$/m, "'## Preflight' — the checks that establish state before acting"],
    [/^## Workflow\b/m, "'## Workflow' — the numbered steps, in execution order"],
    [/^## Stop\s*$/m, "'## Stop' — the conditions that halt the work and get reported"],
    [/^## Rules\s*$/m, "'## Rules' — the judgment specific to this domain"],
    [/^## Checklist\s*$/m, "'## Checklist' — the verifiable end state"],
    [/^```/m, "a command block — show the real invocation, not a description of it"],
    [/^\|.+\|\s*$/m, "a decision table — symptom to action, or option to tradeoff"],
  ]) {
    if (!pattern.test(text)) errors.push(`${skillName}: body is missing ${missing}`);
  }

  if (EXCUSES_REQUIRED.has(skillName) && !/^## Excuses\s*$/m.test(text)) {
    errors.push(
      `${skillName}: body is missing '## Excuses' — the table of excuses for skipping a step, and why each is false`,
    );
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > WORD_BUDGET) {
    errors.push(`${skillName}: ${wordCount} words exceeds the ${WORD_BUDGET}-word budget`);
  }

  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:\/\//i.test(target) || target.startsWith("#")) continue;
    if (!fs.existsSync(path.resolve(skillDirectory, target))) {
      errors.push(`${skillName}: broken local link '${match[1]}'`);
    }
  }

  const referencesRoot = path.join(skillDirectory, "references");
  if (fs.existsSync(referencesRoot)) {
    const referenceCount = fs
      .readdirSync(referencesRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md")).length;
    if (
      referenceCount > 20 &&
      (!fs.existsSync(path.join(referencesRoot, "TOPIC_MAP.md")) ||
        !text.includes("(references/TOPIC_MAP.md)"))
    ) {
      errors.push(
        `${skillName}: ${referenceCount} references require a linked references/TOPIC_MAP.md`,
      );
    }
    errors.push(...findOrphanReferences(skillName, text, referencesRoot));
    errors.push(...findReferencesWithoutContents(skillName, referencesRoot));
  }

  return errors;
}

function findOrphanReferences(skillName, skillText, referencesRoot) {
  // UPSTREAM.md records vendored provenance; it is attribution, not a procedure to route.
  const referenceFiles = walkFiles([referencesRoot], { filter: (file) => file.endsWith(".md") })
    .map((file) => path.relative(referencesRoot, file).replaceAll("\\", "/"))
    .filter((name) => path.basename(name) !== "UPSTREAM.md");

  const mentioned = new Set();
  const collect = (text) => {
    for (const match of text.matchAll(/\]\(([^)#]+)/g)) {
      mentioned.add(path.basename(match[1].trim()));
    }
    for (const match of text.matchAll(/`([\w./-]+\.md)`/g)) {
      mentioned.add(path.basename(match[1]));
    }
  };

  // Only SKILL.md and its linked topic map route: a file reached through another
  // reference is two hops deep, and agents preview those with partial reads.
  collect(skillText);
  const topicMap = path.join(referencesRoot, "TOPIC_MAP.md");
  if (fs.existsSync(topicMap) && skillText.includes("references/TOPIC_MAP.md")) {
    collect(fs.readFileSync(topicMap, "utf8"));
  }

  return referenceFiles
    .filter((name) => name !== "TOPIC_MAP.md" && !mentioned.has(path.basename(name)))
    .map(
      (name) =>
        `${skillName}: orphan reference 'references/${name}' is not routed from SKILL.md or its TOPIC_MAP.md; route it or remove it`,
    );
}

function findReferencesWithoutContents(skillName, referencesRoot) {
  return walkFiles([referencesRoot], { filter: (file) => file.endsWith(".md") })
    .filter((file) => path.basename(file) !== "TOPIC_MAP.md")
    .filter((file) => {
      const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
      return lines.length > 100 && !lines.slice(0, 40).some((line) => /^##\s+Contents\s*$/.test(line));
    })
    .map(
      (file) =>
        `${skillName}: '${path.relative(path.dirname(referencesRoot), file).replaceAll("\\", "/")}' is over 100 lines and needs a '## Contents' section near the top`,
    );
}

export function validateSkillsRoot(agentsRoot) {
  const skillsRoot = path.join(agentsRoot, "skills");
  if (!fs.existsSync(skillsRoot)) return [`Missing skills directory: ${skillsRoot}`];

  return [
    ...listSkillDirectoryNames(skillsRoot).flatMap((name) =>
      validateSkill(path.join(skillsRoot, name)),
    ),
    ...checkRetiredHandoffs(agentsRoot),
  ];
}

function main() {
  const agentsRoot = path.resolve(process.argv[2] ?? ".agents");
  const errors = validateSkillsRoot(agentsRoot);
  if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }

  const count = listSkillDirectoryNames(path.join(agentsRoot, "skills")).length;
  console.log(`${count} skills valid.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
