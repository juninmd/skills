import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSkill } from "./skill-metadata.mjs";

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

  if (!/^## Checklist\s*$/m.test(text)) {
    errors.push(`${skillName}: body is missing '## Checklist'`);
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 400) {
    errors.push(`${skillName}: ${wordCount} words exceeds the 400-word budget`);
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
  }

  return errors;
}

function findOrphanReferences(skillName, skillText, referencesRoot) {
  const referenceFiles = fs
    .readdirSync(referencesRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  const mentioned = new Set();
  const collect = (text) => {
    for (const match of text.matchAll(/\]\(([^)#]+)/g)) {
      mentioned.add(path.basename(match[1].trim()));
    }
    for (const match of text.matchAll(/`([\w./-]+\.md)`/g)) {
      mentioned.add(path.basename(match[1]));
    }
  };

  collect(skillText);
  for (const name of referenceFiles) {
    collect(fs.readFileSync(path.join(referencesRoot, name), "utf8"));
  }

  return referenceFiles
    .filter((name) => !mentioned.has(name))
    .map(
      (name) =>
        `${skillName}: orphan reference 'references/${name}' is never linked or mentioned; route it or remove it`,
    );
}

export function validateSkillsRoot(agentsRoot) {
  const skillsRoot = path.join(agentsRoot, "skills");
  if (!fs.existsSync(skillsRoot)) return [`Missing skills directory: ${skillsRoot}`];

  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => validateSkill(path.join(skillsRoot, entry.name)));
}

function main() {
  const agentsRoot = path.resolve(process.argv[2] ?? ".agents");
  const errors = validateSkillsRoot(agentsRoot);
  if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }

  const count = fs
    .readdirSync(path.join(agentsRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  console.log(`${count} skills valid.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
