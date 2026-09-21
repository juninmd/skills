import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";

export const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function parseSkillDocument(text, source = "SKILL.md") {
  const match = text.match(FRONTMATTER);
  if (!match) throw new Error(`${source}: invalid or missing YAML frontmatter`);

  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) {
    throw new Error(`${source}: invalid YAML: ${document.errors[0].message}`);
  }

  const metadata = document.toJS();
  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    throw new Error(`${source}: frontmatter must be a YAML mapping`);
  }

  return { metadata, body: text.slice(match[0].length) };
}

export function readSkill(skillDirectory) {
  const name = path.basename(skillDirectory);
  const file = path.join(skillDirectory, "SKILL.md");
  const text = fs.readFileSync(file, "utf8");
  const parsed = parseSkillDocument(text, file);
  return { name, file, text, ...parsed };
}

// The one definition of "what are the skill directories under this root",
// shared by the happy-path lister below and by any caller that must isolate
// a bad skill's error instead of losing the whole listing to it.
export function listSkillDirectoryNames(skillsRoot) {
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export function listSkills(skillsRoot) {
  return listSkillDirectoryNames(skillsRoot).map((name) => readSkill(path.join(skillsRoot, name)));
}
