import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skillsRoot = path.join(root, ".agents", "skills");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const skillNames = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const errors = [];

if (!readme.includes(`${skillNames.length} skills`)) {
  errors.push(`README must state the current count: ${skillNames.length} skills`);
}

for (const match of readme.matchAll(/\.agents\/skills\/([^/]+)\/SKILL\.md/g)) {
  if (match[1].includes("<") || match[1].includes(">")) continue;
  if (!skillNames.includes(match[1])) {
    errors.push(`README links to missing skill '${match[1]}'`);
  }
}

for (const name of skillNames) {
  if (!readme.includes(`\`${name}\``) && !readme.includes(`skills/${name}/SKILL.md`)) {
    errors.push(`README does not mention current skill '${name}'`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Catalog matches ${skillNames.length} skills.`);
