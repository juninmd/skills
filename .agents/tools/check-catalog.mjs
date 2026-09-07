import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogFiles, loadCatalog, replaceCatalog } from "./catalog.mjs";
import { listSkills } from "./skill-metadata.mjs";

export function checkCatalog(root = process.cwd()) {
  const readmePath = path.join(root, "README.md");
  const readme = fs.readFileSync(readmePath, "utf8");
  const skills = listSkills(path.join(root, ".agents", "skills"));
  const errors = [];

  if (!readme.includes(`${skills.length} skills`)) {
    errors.push(`README must state the current count: ${skills.length} skills`);
  }

  const catalog = loadCatalog(root);
  for (const file of catalogFiles(root)) {
    const text = file === readmePath ? readme : fs.readFileSync(file, "utf8");
    try {
      if (replaceCatalog(text, catalog) !== text) {
        errors.push(`${path.relative(root, file)} skill catalog is stale; run pnpm run catalog:generate`);
      }
    } catch (error) {
      errors.push(`${path.relative(root, file)}: ${error.message}`);
    }
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
