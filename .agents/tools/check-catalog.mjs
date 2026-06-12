import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog, replaceCatalog } from "./catalog.mjs";
import { listSkills } from "./skill-metadata.mjs";

export function checkCatalog(root = process.cwd()) {
  const readmePath = path.join(root, "README.md");
  const readme = fs.readFileSync(readmePath, "utf8");
  const skills = listSkills(path.join(root, ".agents", "skills"));
  const errors = [];

  if (!readme.includes(`${skills.length} skills`)) {
    errors.push(`README must state the current count: ${skills.length} skills`);
  }

  try {
    if (replaceCatalog(readme, loadCatalog(root)) !== readme) {
      errors.push("README skill catalog is stale; run pnpm run catalog:generate");
    }
  } catch (error) {
    errors.push(error.message);
  }

  return errors;
}

function main() {
  const errors = checkCatalog();
  if (errors.length) {
    console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
    process.exit(1);
  }

  console.log("README skill catalog is current.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
