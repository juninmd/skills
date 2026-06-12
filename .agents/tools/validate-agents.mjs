import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_FIELDS = new Set(["name", "description"]);

export function validateSkill(skillDirectory) {
  const errors = [];
  const skillName = path.basename(skillDirectory);
  const skillFile = path.join(skillDirectory, "SKILL.md");

  if (!fs.existsSync(skillFile)) return [`${skillName}: missing SKILL.md`];

  const text = fs.readFileSync(skillFile, "utf8");
  const frontmatterMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatterMatch) return [`${skillName}: invalid or missing YAML frontmatter`];

  const frontmatter = frontmatterMatch[1];
  const declaredName = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (declaredName !== skillName) {
    errors.push(`${skillName}: frontmatter name must equal the folder name`);
  }

  if (!/^[a-z0-9-]{1,64}$/.test(skillName)) {
    errors.push(`${skillName}: name must be lowercase hyphen-case and at most 64 characters`);
  }

  const fields = [...frontmatter.matchAll(/^([A-Za-z][\w-]*):/gm)].map(
    (match) => match[1],
  );
  for (const field of fields) {
    if (!ALLOWED_FIELDS.has(field)) {
      errors.push(`${skillName}: unsupported frontmatter field '${field}'`);
    }
  }

  const descriptionMatch = frontmatter.match(
    /^description:\s*(?:\|\s*\r?\n((?:[ \t]+.*(?:\r?\n|$))+)|(.+))$/m,
  );
  const description = (descriptionMatch?.[1] ?? descriptionMatch?.[2] ?? "")
    .replace(/^\s+/gm, "")
    .trim();
  if (description.length < 40) {
    errors.push(`${skillName}: description must explain what the skill does and when to use it`);
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

  return errors;
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
